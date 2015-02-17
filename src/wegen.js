'use strict';

const nprogress = require('nprogress');
const page = require('page');
const querystring = require('querystring');
const url = require('url');

/**
 * _callAndDispatch is the default handler. It makes a basic XHR request
 * and passes the results to the route's handler
 */

const _callAndDispatch = (context, callback) => {
  let request = new XMLHttpRequest();
  let self = this;

  request.open('GET', context.canonicalPath, true);
  request.setRequestHeader('Accept', 'application/json');

  request.onload = () => {
    this.progressStop();

    if (request.status >= 200 && request.status < 400) {
      return callback(null, JSON.parse(request.responseText));
    }

    callback(new Error(request.responseText));
  };

  request.send();
};

/**
 * Convenience middleware for adding querystring parameters
 * as an object to page's `context`.
 */

const _parse = (context, next) => {
  context.query = querystring.parse(context.querystring);
  next();
};

class Wegen {
  constructor(routes, handler, progressStart, progressStop) {
    this.handler = handler || _callAndDispatch;
    this.progressStart = progressStart || nprogress.start;
    this.progressStop = progressStop || nprogress.done;

    routes.forEach((routeDef) => {
      this.route(routeDef);
    });

    page('*', _parse);

    page.start();
  }

  get(callback) {
    let self = this;

    return (context) => {
      self.progressStart();
      self.handler.call(self, context, callback);
    };
  }

  /**
   * A `routeDef` is a two-column array consisting of:
   * * 0: The route's canonical path (e.g., '/:thing')
   * * 1: The callback for handling the server response
   */

  route(routeDef) {
    let path = routeDef[0];
    let callback = routeDef[1];

    page(path, this.get(callback));
  }

  stop() {
    page.stop();
  }
};

module.exports = Wegen;
