import aws from "aws-sdk";
import createError from "http-errors";
import commonMidleware from "../lib/commonMiddleware";
import { getAuctionById } from "./getAuction";

const dynamodb = new aws.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionById(id);
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden("auction must be higher than this");
  }
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: { ":amount": amount },
    ReternValues: "ALL_NEW",
  };

  let updatedAuction;
  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  console.log(updatedAuction, "this is updated");
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMidleware(placeBid);
