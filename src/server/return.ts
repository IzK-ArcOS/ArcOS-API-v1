import { ServerResponse } from "http";

export function createErrorRes(
  title: string,
  message: string,
  valid: boolean = false
) {
  return JSON.stringify({
    error: { title, message },
    valid,
  });
}

export function createDataRes(
  data: any,
  valid: boolean,
  error?: { title: string; message: string }
) {
  return JSON.stringify({
    valid,
    data,
    error: {
      title: error?.title || "",
      message: error?.message || "",
    },
  });
}

export function writeToRes(res: ServerResponse, data: string) {
  try {
    if (!res.destroyed) {
      res.write(data);
    }

    res.end();
  } catch {
    return;
  }
}
