// @flow

import ViewRenderer from '../models/view-renderer';
import Router from 'koa-router';
import Application from 'koa';
import type { Context } from 'koa';
import appError from '../helpers/app-error';
const KoaRouter = require('koa-router');
const { PassThrough } = require('stream');

const router: Router = new KoaRouter();

export default (viewRenderer: ViewRenderer, isProd: boolean) => {
  const renderContent = async (ctx: Context, context: Object) => {
    if (!viewRenderer.renderer) {
      appError(ctx, 'An error occured during ViewRenderer init.');
      return;
    }

    ctx.type = 'html';
    ctx.body = new PassThrough();

    try {
      const content: string = await viewRenderer.render(context);

      // $FlowFixMe
      ctx.body.end(content);
    } catch (err) {
      appError(ctx, 'An error occured during rendering: ', 500, err);
    }
  };

  router.get('/', async (ctx: Context, next) => {
    const context = {
      title: `Page title`,
      url: ctx.path
    };

    if (isProd) {
      renderContent(ctx, context);
    } else {
      viewRenderer.ready.then(() => renderContent(ctx, context));
    }
  });

  return router;
};
