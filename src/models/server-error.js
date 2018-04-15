export default class ServerError extends Error {
  statusCode;
  originalStack;

  constructor(message, statusCode = 500, originalError) {
    const msg =
      message +
      (originalError && originalError.message ? originalError.message : '');
    super(msg);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, ServerError);
    this.originalStack = originalError ? originalError.stack : '';
  }
}
