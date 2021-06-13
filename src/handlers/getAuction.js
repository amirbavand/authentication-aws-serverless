import aws from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new aws.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  let auction;
  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id }, //this is similar to id: id
      })
      .promise();

    auction = result.Item;
    console.log(auction, "this is auction result");
  } catch (error) {
    console.error(error, "this is catch block");
    throw new createError.InternalServerError(error);
  }
  if (!auction) {
    console.log("auction not found");
    throw new createError.NotFound(`not found error`);
  }
  return auction;
}

async function getAuction(event, context) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);
