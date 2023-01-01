import { IncomingMessage, ServerResponse } from "http";

export interface Endpoint {
  auth: boolean;
  credAuth: boolean;
  tokenAuth: boolean;
  checkAuth: boolean;
  admin: boolean;
  requiredParams: Param[];
  optionalParams: Param[];
  description: string;
  func: (req: IncomingMessage, res: ServerResponse) => void;
}

export interface Param {
  key: string;
  format: "string" | "base64";
}
