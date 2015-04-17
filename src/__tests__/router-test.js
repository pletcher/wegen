'use strict';

jest.dontMock('../router');

import React from 'react';
import { Map } from 'immutable';

const Div = React.createClass({
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});

const Span = React.createClass({
  render() {
    return <span />
  }
});

describe('Router', () => {
  const { Router } = require('../router');

  describe('buildPath()', () => {
    let path = '/path/to/something';
    let routeObject = {
      component: <div />,
      action: () => {},
      name: "something"
    };
    let routes;

    beforeEach(() => {
      routes = Router.buildPath(path, routeObject);
    });

    it('builds a routing trie', () => {
      expect(routes.get('path') instanceof Map).toBe(true);
      expect(routes.getIn(['path', 'to']) instanceof Map).toBe(true);
      expect(routes.getIn(['path', 'to', 'something']) instanceof Map)
        .toBe(true);
    });

    it('sets the component when it terminates', () => {
      expect(routes.getIn(['path', 'to', 'something', '$$__component']))
        .toEqual(<div />);
    });

    it('sets the action when it terminates', () => {
      expect(
        routes.getIn(['path', 'to', 'something', '$$__action']) instanceof Function
      ).toBe(true);
    });

    it('sets the name when it terminates', () => {
      expect(routes.getIn(['path', 'to', 'something', '$$__name']))
        .toEqual('something');
    });
  });

  describe('constructor()', () => {
    let router;

    beforeEach(() => {
      router = new Router(<span />).routes;
    });

    it('initializes a Router with a component', () => {
      expect(router.get('$$__component')).toEqual(<span />);
    });

    it('does not set a default name', () => {
      expect(router.get('$$__name')).toBeUndefined();
    });

    it('does not set a default action', () => {
      expect(router.get('$$__action')).toBeUndefined();
    });

    it('throws if there is no component', () => {
      expect(() => { new Router() }).
        toThrow('Cannot construct route without `component`.');
    });

    it('accepts { component, path, name, action } instead of args', () => {
      let objRouter = new Router({
        component: <div />,
        path: '/foo',
        name: 'foo'
      });

      let match = objRouter.match('/foo');

      expect(match.get('$$__component')).toEqual(<div />);
      expect(match.get('$$__name')).toEqual('foo');
    });
  });

  describe('render()', () => {
    let router;

    beforeEach(() => {
      router = new Router(Div);
    });

    it("adds a route to the Router's subroutes", () => {
      let subrouter = router.render(Span, '/home');

      expect(router.match('/home').get('$$__component')).toEqual(Span);
    });

    it('returns an instance of a router', () => {
      expect(router.render(Span) instanceof Router).toBe(true);
    });
  });

  describe('mount()', () => {
    let router, subRouter;

    beforeEach(() => {
      router = new Router(Div);
      subRouter = new Router(Span, '/sub');
    });

    it('mounts a router on another router', () => {
      router.mount(subRouter);

      expect(router.match('/sub')).toEqual(subRouter.routes.get('sub'));
    });
  });
});
