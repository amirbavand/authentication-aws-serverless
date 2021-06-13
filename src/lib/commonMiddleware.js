import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-error-handler";
import httpErrorHandler from "@middy/http-event-normalizer";

export default (handler) =>
  middy(handler)
    .use(jsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler());
