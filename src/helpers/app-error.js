import ServerError from '../models/server-error';

export default (ctx, message, statusCode = 500, err) => {
  ctx.app.emit('error', new ServerError(message, statusCode, err), ctx);
};
