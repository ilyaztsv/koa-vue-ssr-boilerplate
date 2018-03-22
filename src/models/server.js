// @flow

import Raven from 'raven';
import pino from 'pino';
import Koa from 'koa';
import Application from 'koa';
import type { ServerType } from 'koa';
import type { Logger } from 'pino';
import type { ServerOptions } from '../types/server-options';
import type { ViewRendererOptions } from '../types/view-renderer-options';
import ServerError from './server-error';
import ViewRenderer from './view-renderer';
import createRouter from '../routes';

// import handleError from 'koa-advanced-handle-error';
// const defineViewRenderer = require('../middlewares/define-view-renderer');

export default class Server {
  _isProductionMode: boolean;
  _port: number;
  _app: Application;
  _logger: Logger;
  _raven: any;
  _viewRenderer: ViewRenderer;
  _instance: ServerType;

  constructor(options: ServerOptions) {
    this._isProductionMode = options.productionMode;
    this._port = options.port;
    this._app = new Koa();

    this._initLogger();
    this._initRaven();
    this._initViewRenderer(options.rendererOptions);
    this._initMiddlewares();
    this._initRouter();
  }

  get isProductionMode(): boolean {
    return this._isProductionMode;
  }

  get port(): number {
    return this._port;
  }

  get app(): Application {
    return this._app;
  }

  get logger(): Logger {
    return this._logger;
  }

  get raven(): any {
    return this._raven;
  }

  get viewRenderer(): ViewRenderer {
    return this._viewRenderer;
  }

  start() {
    this._instance = this._app.listen(this._port.toString(), () => {
      this._logger.info('--------- Started ---------');
      this._logger.info(
        `NODE_ENV: ${
          process.env.NODE_ENV ? process.env.NODE_ENV : 'empty NODE_ENV'
        }`
      );
      this._logger.info(`PORT: ${this._port}`);
      this._logger.info('---------------------------');
    });
  }

  close() {
    this._instance.close(err => {
      if (err) {
        this._logger(err);
        process.exit(1);
      }

      process.exit(0);
    });
  }

  _initLogger() {
    const options = {
      name: 'jtnews-logger',
      level: this._isProductionMode ? 'warn' : 'info'
    };

    const stream = process.stderr;

    if (this._isProductionMode) {
      this._logger = pino(options, stream);
    } else {
      const pretty = pino.pretty();
      pretty.pipe(stream);
      this._logger = pino(options, pretty);
    }
  }

  _initRaven() {
    if (this._isProductionMode) {
      this._raven = Raven.config(process.env.SENTRY_DSN, {
        release: process.env.SENTRY_RELEASE
      }).install();
    }
  }

  _initViewRenderer(options: ViewRendererOptions) {
    try {
      this._viewRenderer = new ViewRenderer(this._app, options);
    } catch (err) {
      throw new ServerError('Ошибка при создании ViewRenderer: ', 500, err);
    }
  }

  _initMiddlewares() {
    // мидлвара для обработки ошибок
    // this._app.use(handleError(this._app, this._logger, this._raven));
    // добавим в контекст наш viewRenderer, чтобы использовать в роутах
    // this._app.use(defineViewRenderer(this._viewRenderer));
  }

  _initRouter() {
    const router = createRouter(this._viewRenderer, this._isProductionMode);

    // @TODO: allowedMethods
    this._app.use(router.routes()).use(router.allowedMethods());
  }
}
