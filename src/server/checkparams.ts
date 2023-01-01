import { IncomingMessage } from "http";
import { Endpoint } from "./endpoint/main";
import url from "url";

export function checkParams(endpoint: Endpoint, req: IncomingMessage) {
  if (typeof req.url !== "string") {
    console.log("checkParams failed: req.url is not a string");
    return false;
  }
  const reqParams = endpoint.requiredParams;
  const query = url.parse(req.url as string, true).query;

  for (let i = 0; i < reqParams.length; i++) {
    if (!query[reqParams[i].key]) {
      return false;
    }
  }

  return true;
}
