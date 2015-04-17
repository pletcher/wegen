'use strict';

import React from 'react';
import { List, Map, Record } from 'immutable';

const _findNode = (pathMap, pathList, Component) => {
  let newComponent;
  if (pathMap.get('$$__component')) {
    if (!Component) {
      newComponent = pathMap.get('$$__component');
    } else {
      newComponent = (
        <Component>
          {pathMap.get('$$__component')}
        </Component>
      );
    }
  }

  if (pathList.size === 0) {
    return pathMap;
  }

  let nextNode = pathList.get(0);

  return _findNode(pathMap.get(nextNode), pathList.shift(), newComponent);
}

const _makePathList = (path) => {
  let pathList = path.split('/');

  while (pathList[0] === '') {
    pathList.shift();
  }

  return List(pathList);
}

const _terminatePathWith = (routeObject) => {
  const _buildPath = (pathMap, pathList) => {
    if (pathList.size === 0) {
      pathMap = pathMap.set('$$__component', routeObject.component);
      pathMap = pathMap.set('$$__action', routeObject.action);
      pathMap = pathMap.set('$$__name', routeObject.name);
      return pathMap;
    }

    let nextKey = pathList.get(0);

    return pathMap.set(
      nextKey,
      _buildPath(Map(), pathList.shift())
    );
  }

  return _buildPath;
};

class MissingComponentError extends Error {
  constructor() {
    super('Cannot construct route without `component`.');
  }
};

export class Router {
  static buildPath(path, routeObject) {
    let pathNodes = _makePathList(path);

    return _terminatePathWith(routeObject)(Map(), pathNodes);
  }

  constructor(component, path, name, action) {
    if (!component) {
      throw new MissingComponentError();
    }

    let routeObject;
    if (component.component) {
      routeObject = {
        component: component.component,
        path: component.path,
        name: component.name,
        action: component.action
      };
    } else {
      routeObject = { component, name, action };
    }

    path = path || component.path || '/';
    this.routes = Router.buildPath(path, routeObject);

    return this;
  }

  match(path) {
    let pathNodes = _makePathList(path);

    return _findNode(this.routes, pathNodes);
  }

  mount(router) {
    this.routes = this.routes.merge(router.routes);
  }

  render(component, path, name, action) {
    let router = new Router(component, path, name, action);

    this.mount(router, path || component.path || '/');

    return router;
  }
};
