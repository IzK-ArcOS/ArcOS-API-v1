import { ServerResponse } from "http";

export type ErrorMessage = { title: string; message: string };

export function Error(title: string, message: string, valid: boolean = false) {
  return JSON.stringify({
    error: { title, message },
    valid,
  });
}

export function DataRes(data: any, valid: boolean, error?: ErrorMessage) {
  return JSON.stringify({
    valid,
    data,
    error: {
      title: error?.title || "",
      message: error?.message || "",
    },
  });
}

export function Ok(res: ServerResponse, data: string, statusCode?: number) {
  try {
    res.statusCode = statusCode || 200;

    if (!res.destroyed) {
      res.write(data);
    }

    res.end();
  } catch {
    return;
  }
}
