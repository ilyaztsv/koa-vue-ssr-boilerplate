// @flow

export default class ServerError extends Error {
  statusCode: number;
  originalStack: string | null;

  constructor(
    message: string,
    statusCode?: number = 500,
    originalError?: Error
  ) {
    const msg: string =
      message +
      (originalError && originalError.message ? originalError.message : '');
    super(msg);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, ServerError);
    this.originalStack = originalError ? originalError.stack : '';
  }
}
