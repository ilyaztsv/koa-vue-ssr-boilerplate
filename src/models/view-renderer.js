// @flow
const fs = require('fs');
const path = require('path');
const VueServerRenderer = require('vue-server-renderer');
import type { ViewRendererOptions } from '../types/view-renderer-options';
import Application from 'koa';

export default class ViewRenderer {
  baseDir: string;
  template: string;
  bundle: string;
  clientManifest: string;
  renderer: any;
  ready: any;

  constructor(app: Application, options: ViewRendererOptions) {
    this.baseDir = options.baseDir;
    this.template = options.template;
    this.bundle = options.bundle;
    this.clientManifest = options.clientManifest;

    if (options.devMode !== true) {
      this.renderer = this.createRenderer();
    } else {
      const devServer = require(options.devServer);
      this.ready = devServer(app, (bundle, opts) => {
        this.renderer = this.createRenderer();
      });
    }
  }

  createRenderer(): any {
    return VueServerRenderer.createBundleRenderer(this.bundle, {
      template: this.template,
      basedir: this.baseDir,
      runInNewContext: false
    });
  }

  render(context: Object): Promise<string> {
    return new Promise((resolve, reject) => {
      this.renderer.renderToString(context, (err, html) => {
        if (err) {
          reject(err);
        }
        resolve(html);
      });
    });
  }
}
