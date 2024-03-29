import { IncomingMessage, ServerResponse } from "http";
import url from "url";
import { getAuth } from "../auth/get";
import { verifyCredentials } from "../auth/main";
import { isAdmin, isDisabled } from "../auth/role";
import { verifyToken, verifyTokenByReq } from "../auth/token";
import { checkParams } from "./checkparams";
import { Endpoint } from "./endpoint/main";
import { Error, Ok } from "./return";

export async function serverListener(
  req: IncomingMessage,
  res: ServerResponse,
  evaluator: Map<string, Endpoint>
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Accept-Ranges", "bytes");

  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method == "OPTIONS") {
    res.statusCode = 200;
    res.end();

    return;
  }

  if (typeof req.url !== "string") {
    Ok(
      res,
      Error(
        "Request cancelled",
        "Cannot process a request that doesn't contain a valid URL.",
        false
      ),
      400
    );

    return;
  }

  const pathName = url.parse(req.url as string, true).pathname as string;

  if (!evaluator.has(pathName)) {
    console.log(
      `server: serverListener: processing request for ${pathName.padEnd(
        30,
        " "
      )} | Invalid: YES`
    );

    Ok(
      res,
      Error("Not found", "The specified API path could not be found."),
      404
    );

    return;
  }
  const endpoint = evaluator.get(pathName) as Endpoint;
  const { username, password } = getAuth(req);
  const token = req.headers.authorization
    ? req.headers.authorization?.replace("Bearer", "").trim()
    : "";
  const userIsAdmin = await isAdmin(
    endpoint.tokenAuth ? ((await verifyTokenByReq(req)) as string) : username
  );
  const correctBasic = await verifyCredentials(username, password);
  const correctToken =
    endpoint.tokenAuth && (await verifyToken(endpoint, token));

  console.log(
    `[SERVER] [${
      correctToken && token ? token : "INVALID_TOKEN"
    }] ${new Date().getTime()} Incoming request for ${pathName}`
  );

  if (await isDisabled(username)) {
    Ok(
      res,
      Error("Disabled", "Your account is disabled and cannot be used."),
      401
    );

    return;
  }

  if ((!username || !password) && !endpoint.tokenAuth && endpoint.auth) {
    Ok(
      res,
      Error(
        "Unauthorized",
        "This endpoint requires authentication, which wasn't provided."
      ),
      400
    );

    return;
  }

  if (!correctBasic && !endpoint.tokenAuth && endpoint.auth) {
    Ok(
      res,
      Error(
        "Access denied",
        "Cannot access entrypoint: invalid credentials specified!"
      ),
      401
    );

    return;
  }

  if (!correctToken && endpoint.tokenAuth && endpoint.auth) {
    Ok(
      res,
      Error(
        "Access denied",
        "Cannot access entrypoint: invalid token specified!"
      ),
      401
    );

    return;
  }

  if (!userIsAdmin && endpoint.admin) {
    return Ok(
      res,
      Error(
        "Access denied",
        "This endpoint requires administrative privileges."
      ),
      401
    );
  }

  if (checkParams(endpoint, req)) {
    res.statusCode = 200;

    try {
      evaluator.get(pathName)?.func(req, res);
    } catch {
      Ok(
        res,
        Error(
          "Server error",
          "The endpoint failed to execute because of an unhandled exception.",
          false
        ),
        500
      );
    }

    return;
  }

  Ok(
    res,
    Error(
      "Bad request",
      "This endpoint requires some parameters that weren't provided."
    ),
    400
  );

  res.end();
}
