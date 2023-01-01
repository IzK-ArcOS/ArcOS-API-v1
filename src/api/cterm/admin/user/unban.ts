import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { userExists } from "../../../../auth/user";
import { createErrorRes, writeToRes } from "../../../../server/return";

export async function adminUserUnban(
  req: IncomingMessage,
  res: ServerResponse
) {
  const query = url.parse(req.url as string, true).query;
  const username = atob(query["user"] as string);

  if (!(await userExists(username))) {
    writeToRes(
      res,
      createErrorRes(
        "No need to use the hammer...",
        "The user you tried to unban doesn't exist.",
        false
      )
    );

    return;
  }

  writeToRes(
    res,
    createErrorRes(
      "Unbanned",
      "No need to let the ban hammer speak, this user is not banned.",
      false
    )
  );
}
