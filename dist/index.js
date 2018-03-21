'use strict';

const bluebird = require('bluebird');
const Server = require('./src/models/server');

global.Promise = bluebird;

const server = new Server();

const koaStatic = require('koa-static');
const path = require('path');
const rootPath = path.resolve(__dirname, './');
const resolve = file => path.resolve(rootPath, file);
const serve = filepath => koaStatic(resolve(filepath));
server.app.use(serve('www'));

server.start();

function closeConnection() {
  server.close();
}

process.on('message', function(msg) {
  if (msg === 'shutdown') {
    closeConnection();
  }
});

process.on('SIGTERM', () => {
  closeConnection();
});
