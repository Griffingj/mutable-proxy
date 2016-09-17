import expect              from 'expect';
import Lab                 from 'lab';
import mutableProxyFactory from '../index';

const lab = exports.lab = Lab.script();
const { describe, it, beforeEach } = lab;

describe('controller', () => {
  describe('setTarget', () => {
    describe('proxy', () => {
      let proxy;
      let setTarget;

      beforeEach(done => {
        const controller = mutableProxyFactory();
        proxy = controller.proxy;
        setTarget = controller.setTarget;
        done();
      });

      describe('when object set as target', () => {
        it('should be a plain object', done => {
          setTarget({ a: 'apple' });
          expect(Object.getPrototypeOf(proxy)).toEqual(Object.prototype);
          done();
        });
      });

      describe('when callable set as target', () => {
        it('should be a function', done => {
          setTarget(() => 5);
          expect(Object.getPrototypeOf(proxy)).toEqual(Function.prototype);
          done();
        });
      });

      describe('when array set as target', () => {
        it('should be an array', done => {
          setTarget([1, 2, 3]);
          expect(Object.getPrototypeOf(proxy)).toEqual(Array.prototype);
          done();
        });
      });

      describe('when object then callable set as target ', () => {
        beforeEach(done => {
          setTarget({ a: 'apple' });
          setTarget(() => 5);
          done();
        });

        it('should be a function', done => {
          expect(Object.getPrototypeOf(proxy)).toEqual(Function.prototype);
          done();
        });
      });

      describe('when object then array set as target ', () => {
        beforeEach(done => {
          setTarget({ a: 'apple' });
          setTarget([]);
          done();
        });

        it('should be an array', done => {
          expect(Object.getPrototypeOf(proxy)).toEqual(Array.prototype);
          done();
        });
      });

      describe('when callable then object set as target ', () => {
        beforeEach(done => {
          setTarget(() => 5);
          setTarget({ a: 'apple' });
          done();
        });

        it('should be a plain object', done => {
          expect(Object.getPrototypeOf(proxy)).toEqual(Object.prototype);
          done();
        });
      });

      describe('when callable then array set as target ', () => {
        beforeEach(done => {
          setTarget(() => 5);
          setTarget([]);
          done();
        });

        it('should be array', done => {
          expect(Object.getPrototypeOf(proxy)).toEqual(Array.prototype);
          done();
        });
      });

      describe('when array then object set as target ', () => {
        beforeEach(done => {
          setTarget([1, 2, 3]);
          setTarget({ a: 'apple' });
          done();
        });

        it('should be a plain object', done => {
          expect(Object.getPrototypeOf(proxy)).toEqual(Object.prototype);
          done();
        });
      });

      describe('when array then callable set as target ', () => {
        beforeEach(done => {
          setTarget([]);
          setTarget(() => 5);
          done();
        });

        it('should be a function', done => {
          expect(Object.getPrototypeOf(proxy)).toEqual(Function.prototype);
          done();
        });
      });
    });
  });
});
