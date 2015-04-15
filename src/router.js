'use strict';

import React from 'react';
import { Map, Record } from 'immutable';

export class Router extends Record({
  action: () => {},
  component: null,
  name: '',
  path: '/'
}) {
  constructor(component, path, name, action) {
    if (!component) {
      throw new Error('Cannot construct route without `component`.')
    }

    if (!React.isValidElement(component)) {
      if (!component.component) {
        throw new Error('Cannot construct route without `component`.');
      }

      super(component);
    } else {
      let record = { component };

      if (path) {
        record.path = path;
      }

      if (name) {
        record.name = name;
      }

      if (action) {
        record.action = action;
      }

      super(record);
    }

    this.subroutes = Map();
  }

  mount(router, path) {
    this.subroutes = this.subroutes.set(
      path || router.get('path') || '/',
      router
    );
  }

  render(component, path, name, action) {
    let route = new Router(component, path, name, action);

    this.subroutes = this.subroutes.set(route.get('path'), route);

    return route;
  }
};
