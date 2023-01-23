import { IncomingMessage, ServerResponse } from "http";
import { getAuth } from "../../../auth/get";
import { createUser } from "../../../auth/user";
import { createErrorRes, Ok } from "../../../server/return";

export async function ArcOSUserCreate(
  req: IncomingMessage,
  res: ServerResponse
) {
  const { username, password } = getAuth(req);

  console.error(username, password);

  const createStatus = await createUser(username, password);

  if (createStatus != "created") {
    const codes: { [key: string]: number } = {
      dbgeterror: 500,
      dbseterror: 304,
      userexists: 409,
    };

    res.statusCode = codes[createStatus];

    Ok(
      res,
      createErrorRes(
        "User not created",
        `Error code returned by user creator: ${createStatus.toUpperCase()}`
      )
    );
  } else {
    Ok(
      res,
      createErrorRes(
        "User created",
        "User created successfully. Use '/auth' to generate a token for the account.",
        true
      )
    );
  }
}
