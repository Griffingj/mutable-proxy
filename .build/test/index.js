'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _lab = require('lab');

var _lab2 = _interopRequireDefault(_lab);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lab = exports.lab = _lab2.default.script();
var describe = lab.describe;
var it = lab.it;


describe('voila', function () {
  describe('#create', function () {
    it('returns a dependency injection container', function (done) {
      var diContainer = _index2.default.create();
      (0, _expect2.default)(diContainer.register).toExist();
      (0, _expect2.default)(diContainer.resolve).toExist();
      done();
    });
  });

  describe('dependency injection container', function () {
    describe('circular reference', function () {
      it('resolves correctly', function () {
        var diContainer = _index2.default.create();

        diContainer.register({
          key: 'a',
          factory: function factory(b) {
            return {
              message: function message() {
                return 'In a with b.message(): "' + b.message() + '"';
              },
              forB: function forB() {
                return 'hello';
              }
            };
          },

          requirements: ['b']
        });

        diContainer.register({
          key: 'b',
          factory: function factory(a) {
            return {
              message: function message() {
                return 'In b with a.forB(): ' + a.forB();
              }
            };
          },

          requirements: ['a']
        });

        return diContainer.resolve('a').then(function (a) {
          (0, _expect2.default)(a.message()).toExist();
        });
      });
    });
  });
});