'use strict';

jest.dontMock('../router');

import React from 'react';
import { Map } from 'immutable';

describe('Router', () => {
  const { Router } = require('../router');

  describe('constructor()', () => {
    let router;

    beforeEach(() => {
      router = new Router(<span />);
    });

    it('intializes a Router with a component', () => {
      expect(router.get('component')).toEqual(<span />);
    });

    it('does not set a default path', () => {
      expect(router.get('path')).toEqual('/');
    });

    it('sets a default name', () => {
      expect(router.get('name')).toEqual('');
    });

    it('sets a default action', () => {
      expect(typeof router.get('action')).toEqual('function');
    });

    it('sets default subroutes', () => {
      expect(router.subroutes).toEqual(Map());
    });

    it('throws if there is no component', () => {
      expect(() => { new Router() }).
        toThrow('Cannot construct route without `component`.');
    });

    it('accepts { component, path, name, action } instead of args', () => {
      let router = new Router({
        component: <div />,
        path: '/foo',
        name: 'foo'
      });

      expect(router.get('component')).toEqual(<div />);
      expect(router.get('path')).toEqual('/foo');
      expect(router.get('name')).toEqual('foo');
    });
  });

  describe('render()', () => {
    let router;

    beforeEach(() => {
      router = new Router(<span />, '/home');
    });

    it("adds a route to the Router's subroutes", () => {
      let subroute = router.render(<div />);

      expect(router.subroutes.get('/')).toEqual(subroute);
    });

    it('returns an instance of a router', () => {
      expect(router.render(<div />) instanceof Router).toBe(true);
    });
  });

  describe('mount()', () => {
    let router, subrouter;

    beforeEach(() => {
      router = new Router(<span />);
      subRouter = new Router(<div />, '/sub');
    });

    it('mounts a router on another router', () => {
      router.mount(subRouter);

      expect(router.subroutes.get('/sub')).toEqual(subRouter);
    });
  });
});
