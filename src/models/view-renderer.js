import fs from 'fs';
import path from 'path';
const VueServerRenderer = require('vue-server-renderer');

export default class ViewRenderer {
  baseDir;
  template;
  bundle;
  clientManifest;
  renderer;
  ready;

  constructor(app, options) {
    this.baseDir = options.baseDir;
    this.template = fs.readFileSync(options.template, 'utf-8');
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

  createRenderer() {
    return VueServerRenderer.createBundleRenderer(this.bundle, {
      template: this.template,
      basedir: this.baseDir,
      runInNewContext: false
    });
  }

  render(context) {
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
