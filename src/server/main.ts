import url from "url";
import path from "path";
import http, { IncomingMessage, RequestListener, ServerResponse } from "http";
import { Endpoint } from "./endpoint/main";
import { createErrorRes, writeToRes } from "./return";
import { verifyDBs } from "../db/main";
import { checkParams } from "./checkparams";
import { getAuth } from "../auth/get";
import { isAdmin, isDisabled } from "../auth/role";
import { verifyCredentials } from "../auth/main";
import { verifyToken } from "../auth/token";

export function makeServer(
  port: number,
  name: string,
  evaluator: Map<string, Endpoint>
) {
  verifyDBs();

  console.log(`Creating HTTP server ${name} on localhost:${port}`);

  const server = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader("content-type", "application/json");

      serverListener(req, res, evaluator);
    }
  );

  server.listen(port);
}

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
    res.statusCode = 400;

    writeToRes(
      res,
      createErrorRes(
        "Request cancelled",
        "Cannot process a request that doesn't contain a valid URL.",
        false
      )
    );

    return;
  }

  const pathName = url.parse(req.url as string, true).pathname as string;

  if (evaluator.has(pathName)) {
    const endpoint = evaluator.get(pathName) as Endpoint;
    const { username, password } = getAuth(req);
    const token = req.headers.authorization
      ? req.headers.authorization?.replace("Bearer", "").trim()
      : "";
    const userIsAdmin = await isAdmin(username);
    const correctBasic = await verifyCredentials(username, password);
    const correctToken =
      endpoint.tokenAuth && (await verifyToken(endpoint, token));

    console.log(
      `server: serverListener: processing request for ${pathName.padEnd(
        30,
        " "
      )} | ${endpoint.auth ? "Auth: YES" : "Auth:  NO"} | ${
        endpoint.checkAuth ? "VerifyAuth: YES" : "VerifyAuth:  NO"
      } | ${endpoint.admin ? "Admin: YES" : "Admin:  NO"}`
    );

    if (await isDisabled(username)) {
      res.statusCode = 401;

      writeToRes(
        res,
        createErrorRes(
          "Disabled",
          "Your account is disabled and cannot be used."
        )
      );

      return;
    }

    if ((!username || !password) && endpoint.auth) {
      res.statusCode = 400;

      writeToRes(
        res,
        createErrorRes(
          "Unauthorized",
          "This endpoint requires authentication, which wasn't provided."
        )
      );

      return;
    }

    if (!correctBasic && !endpoint.tokenAuth && endpoint.auth) {
      res.statusCode = 401;

      writeToRes(
        res,
        createErrorRes(
          "Access denied",
          "Cannot access entrypoint: invalid credentials specified!"
        )
      );

      return;
    }

    if (!correctToken && endpoint.tokenAuth && endpoint.auth) {
      res.statusCode = 401;

      writeToRes(
        res,
        createErrorRes(
          "Access denied",
          "Cannot access entrypoint: invalid token specified!"
        )
      );

      return;
    }

    if (checkParams(endpoint, req)) {
      res.statusCode = 200;

      try {
        evaluator.get(pathName)?.func(req, res);
      } catch {
        res.statusCode = 500;

        writeToRes(
          res,
          createErrorRes(
            "Server error",
            "The endpoint failed to execute because of an unhandled exception.",
            false
          )
        );
      }

      return;
    }

    res.statusCode = 400;

    writeToRes(
      res,
      createErrorRes(
        "Bad request",
        "This endpoint requires some parameters that weren't provided."
      )
    );
  } else {
    console.log(
      `server: serverListener: processing request for ${pathName.padEnd(
        30,
        " "
      )} | Invalid: YES`
    );
    res.statusCode = 404;

    writeToRes(
      res,
      createErrorRes("Not found", "The specified API path could not be found.")
    );
  }

  res.end();
}
