// @flow
import ServerError from '../models/server-error';
import type { Context } from 'koa';

export default (
  ctx: Context,
  message: string,
  statusCode?: number = 500,
  err?: Error
) => {
  ctx.app.emit('error', new ServerError(message, statusCode, err), ctx);
};
