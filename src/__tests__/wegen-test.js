'use strict';

jest.dontMock('../wegen');

describe('Wegen', () => {
  let testFunc = jest.genMockFn(),
    Wegen = require('../wegen');

  const TEST_ROUTES = [
    ['/', testFunc]
  ];
  afterEach(() => {
    testFunc.mockClear();
  });

  describe('constructor()', () => {
    let w;

    beforeEach(() => {
      w = new Wegen(TEST_ROUTES);
    });

    it('throws if not passed routes', () => {
      expect(() => { new Wegen() }).toThrow();
    });

    it('has a default progressStart function', () => {
      expect(typeof w.progressStart).toEqual('function');
    });

    it('has a default progressStop function', () => {
      expect(typeof w.progressStop).toEqual('function');
    });

    it('has a default handler function', () => {
      expect(typeof w.handler).toEqual('function');
    });
  });

  describe('get()', () => {
    let w,
      handler = jest.genMockFn(),
      progressStart = jest.genMockFn(),
      progressStop = jest.genMockFn();

    beforeEach(() => {
      w = new Wegen(TEST_ROUTES, progressStart, progressStop);
    });

    afterEach(() => {
      [handler, progressStart, progressStop].forEach(f => f.mockClear());
    });

    it('returns a function', () => {
      expect(typeof w.get()).toEqual('function');
    });

    it('starts progress', () => {
      w.get()();

      expect(w.progressStart.mock.calls.length).toEqual(1);
    });

    it('calls the handler', () => {
      w.get()();

      expect(w.handler.mock.calls.length).toEqual(1);
    });
  });

  describe('route()', () => {
    let page = require('page');

    it('passes a callback to `page`', () => {
      new Wegen(TEST_ROUTES);

      expect(page).toBeCalledWith('/', testFunc);
    });
  });

  describe('stop()', () => {
    let page = require('page');

    it('stops `page`', () => {
      w = new Wegen(TEST_ROUTES);
      w.stop();

      expect(page.stop).toBeCalled();
    });
  });
});
