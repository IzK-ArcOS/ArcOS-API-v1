import { mkdir } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import { getAuth } from "../../../auth/get";
import { createUser } from "../../../auth/user";
import { fsroot } from "../../../env/main";
import { deployTemplate } from "../../../fs/templating/main";
import { Error, Ok } from "../../../server/return";

export async function ArcOSUserCreate(
  req: IncomingMessage,
  res: ServerResponse
) {
  const { username, password } = getAuth(req);

  if (!username || !password) {
    Ok(res, Error("User not created", "Missing username or password", false));

    return;
  }

  const createStatus = await createUser(username, password);

  if (createStatus != "created") {
    const codes: { [key: string]: number } = {
      dbgeterror: 500,
      dbseterror: 304,
      userexists: 409,
    };

    Ok(
      res,
      Error(
        "User not created",
        `Error code returned by user creator: ${createStatus.toUpperCase()}`
      ),
      codes[createStatus]
    );

    return;
  }

  try {
    await mkdir(`${fsroot}/${username}`, { recursive: true });
    await deployTemplate(username);
  } catch {
    console.warn("User directory could not be created, it may already exist.");
  }

  Ok(
    res,
    Error(
      "User created",
      "User created successfully. Use '/auth' to generate a token for the account.",
      true
    )
  );
}
