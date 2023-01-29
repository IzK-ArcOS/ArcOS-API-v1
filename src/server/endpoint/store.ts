import { ArcOSAuth } from "../../api/arcos/auth";
import { ArcOSConnect } from "../../api/arcos/connect";
import { ArcOSFSDirCreate } from "../../api/arcos/fs/dir/create";
import { ArcOSFSDirGet } from "../../api/arcos/fs/dir/get";
import { ArcOSUserChangePassword } from "../../api/arcos/user/changepswd";
import { ArcOSUserCreate } from "../../api/arcos/user/create";
import { ArcOSUserDelete } from "../../api/arcos/user/delete";
import { ArcOSUserProperties } from "../../api/arcos/user/properties";
import { ArcOSUserPropertiesUpdate } from "../../api/arcos/user/properties/update";
import { ArcOSUserRename } from "../../api/arcos/user/rename";
import { ArcOSUsersGet } from "../../api/arcos/users/get";
import { Endpoint } from "./main";

export const ArcEval = new Map<string, Endpoint>([
  [
    "/auth",
    {
      auth: true,
      credAuth: true,
      tokenAuth: false,
      checkAuth: true,
      admin: false,
      requiredParams: [],
      optionalParams: [],
      description: "Generate a token from credentials in request body",
      func: ArcOSAuth,
    },
  ],
  [
    "/user/create",
    {
      auth: false,
      credAuth: true,
      tokenAuth: false,
      checkAuth: false,
      admin: false,
      requiredParams: [],
      optionalParams: [],
      description: "Create a user",
      func: ArcOSUserCreate,
    },
  ],
  [
    "/user/properties",
    {
      auth: true,
      credAuth: false,
      tokenAuth: true,
      checkAuth: true,
      admin: false,
      requiredParams: [],
      optionalParams: [],
      description: "Get properties of the authenticated user",
      func: ArcOSUserProperties,
    },
  ],
  [
    "/user/properties/update",
    {
      auth: true,
      credAuth: false,
      tokenAuth: true,
      checkAuth: true,
      admin: false,
      requiredParams: [],
      optionalParams: [],
      description: "Get properties of the authenticated user",
      func: ArcOSUserPropertiesUpdate,
    },
  ],
  [
    "/user/delete",
    {
      auth: true,
      credAuth: false,
      tokenAuth: true,
      checkAuth: true,
      admin: false,
      requiredParams: [],
      optionalParams: [],
      description: "Delete own account",
      func: ArcOSUserDelete,
    },
  ],
  [
    "/user/rename",
    {
      auth: true,
      credAuth: false,
      tokenAuth: true,
      checkAuth: true,
      admin: false,
      requiredParams: [{ key: "newname", format: "base64" }],
      optionalParams: [],
      description: "Rename own account to new username",
      func: ArcOSUserRename,
    },
  ],
  [
    "/user/changepswd",
    {
      auth: true,
      credAuth: true,
      tokenAuth: false,
      checkAuth: true,
      admin: false,
      requiredParams: [{ key: "new", format: "base64" }],
      optionalParams: [],
      description: "Change your password",
      func: ArcOSUserChangePassword,
    },
  ],
  [
    "/connect",
    {
      auth: false,
      credAuth: false,
      tokenAuth: false,
      checkAuth: false,
      admin: false,
      requiredParams: [],
      optionalParams: [],
      description: "Connect to the API from the ArcOS frontend",
      func: ArcOSConnect,
    },
  ],
  [
    "/users/get",
    {
      auth: false,
      credAuth: false,
      tokenAuth: false,
      checkAuth: false,
      admin: false,
      requiredParams: [],
      optionalParams: [],
      description: "Get a public list of users for the login screen",
      func: ArcOSUsersGet,
    },
  ],
  [
    "/fs/dir/get",
    {
      auth: true,
      credAuth: false,
      tokenAuth: true,
      checkAuth: true,
      admin: false,
      requiredParams: [],
      optionalParams: [{ key: "path", format: "base64" }],
      description: "Get the contents of a directory",
      func: ArcOSFSDirGet,
    },
  ],
  [
    "/fs/dir/create",
    {
      auth: true,
      credAuth: false,
      tokenAuth: true,
      checkAuth: true,
      admin: false,
      requiredParams: [{ key: "path", format: "base64" }],
      optionalParams: [],
      description: "Create a directory",
      func: ArcOSFSDirCreate,
    },
  ],
]);
