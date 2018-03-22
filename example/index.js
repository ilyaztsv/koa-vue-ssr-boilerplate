const path = require('path');
const server = require('../lib/index').server;

const isProd = process.env.NODE_ENV === 'production';
const resolve = file => path.resolve(__dirname, file);

const config = {
  productionMode: true,
  port: 9000,
  rendererOptions: {
    baseDir: __dirname,
    template: resolve('index.template.html'),
    bundle: resolve('vue-ssr-server-bundle.json'),
    clientManifest: resolve('vue-ssr-client-manifest.json'),
    devMode: false
  }
};

server(config);
