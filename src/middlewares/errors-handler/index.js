module.exports = (app, logger, raven) => {
  const isRavenInstalled = raven && raven.installed;

  const handleError = (err, ctx) => {
    if (ctx) {
      ctx.status = err.statusCode || err.status || 500;
      ctx.body = 'Error';
    }

    logger.error(err);
    if (isRavenInstalled) {
      raven.captureException(err);
    }
  };

  const handleWarning = warning => {
    logger.warn(warning);
    if (isRavenInstalled) {
      raven.captureMessage(warning);
    }
  };

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.app.emit('error', err, ctx);
    }
  });

  app.on('error', (err, ctx) => {
    handleError(err, ctx);
  });

  process.on('unhandledRejection', (err, promise) => {
    throw err;
  });

  process.on('rejectionHandled', promise => {
    throw new Error('rejectionHandled: ' + arguments[2].toString());
  });

  process.on('uncaughtException', err => {
    handleError(err);
    process.exit(1);
  });

  process.on('warning', warning => {
    handleWarning(warning);
  });

  return async (ctx, next) => {
    await next();
  };
};
