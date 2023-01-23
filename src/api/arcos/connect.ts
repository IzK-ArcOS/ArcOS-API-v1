import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { Ok } from "../../server/return";

export async function ArcOSConnect(req: IncomingMessage, res: ServerResponse) {
  Ok(
    res,
    JSON.stringify({
      platform: "ArcOS",
      hostname: url.parse(req.url as string, true).hostname,
      valid: true,
    })
  );
}
