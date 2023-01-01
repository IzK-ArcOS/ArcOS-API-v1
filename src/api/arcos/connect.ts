import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { writeToRes } from "../../server/return";

export async function ArcOSConnect(req: IncomingMessage, res: ServerResponse) {
  writeToRes(
    res,
    JSON.stringify({
      platform: "ArcOS",
      hostname: url.parse(req.url as string, true).hostname,
      valid: true,
    })
  );
}
