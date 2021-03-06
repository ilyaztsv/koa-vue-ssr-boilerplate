import ViewRenderer from '../models/view-renderer';
import Router from 'koa-router';
import appError from '../helpers/app-error';
const KoaRouter = require('koa-router');
const { PassThrough } = require('stream');

const router = new KoaRouter();

export default (viewRenderer, isProd) => {
  const renderContent = async (ctx, context) => {
    if (!viewRenderer.renderer) {
      appError(ctx, 'An error occured during ViewRenderer init.');
      return;
    }

    ctx.type = 'html';
    ctx.body = new PassThrough();

    try {
      const content = await viewRenderer.render(context);

      ctx.body.end(content);
    } catch (err) {
      appError(ctx, 'An error occured during rendering: ', 500, err);
    }
  };

  router.get('/', async (ctx, next) => {
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
