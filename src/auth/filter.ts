export const isUsernameValid = (s: string) =>
  !!s.match(/^(?:[a-zA-Z0-9-_]+)$/g)?.length;
