//
//  Created by Mingliang Chen on 17/8/1.
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//


const Fs = require('fs');
const Http = require('http');
const Express = require('express');
const basicAuth = require('basic-auth-connect');
const HTTP_PORT = 80;
const Logger = require('./node_core_logger');
const context = require('./node_core_ctx');

const vagRoute = require('./api/routes/vag');

class NodeHttpServer {
  constructor(config) {

    this.config = config;
    this.port = config.VAG.http.port = config.VAG.http.port ? config.VAG.http.port : HTTP_PORT;
    let app = Express();

    if (this.config.VAG.auth && this.config.VAG.auth.api) {
      app.use('/api/*', basicAuth(this.config.VAG.auth.api_user, this.config.VAG.auth.api_pass));
    }

    app.use('/api/v1/vag', vagRoute(context));

    app.get('/', (req, res, next) => {
      res.setHeader('Content-type', 'application/json');
      res.setHeader('Server', 'VAG');
      res.send('{"success":true,"name":"YTMS-VAG 网关","version":"1.0.0.0"}');
      res.end();
    });

    this.httpServer = Http.createServer(app);
  }

  run() {
    this.httpServer.listen(this.port, () => {
      Logger.log(`Node Media Http Server started on port: ${this.port}`);
    });

    this.httpServer.on('error', (e) => {
      Logger.error(`Node Media Http Server ${e}`);
    });

    this.httpServer.on('close', () => {
      Logger.log('Node Media Http Server Close.');
    });
  }

  stop() {
    this.httpServer.close();
    if (this.httpsServer) {
      this.httpsServer.close();
    }
  }
}

module.exports = NodeHttpServer