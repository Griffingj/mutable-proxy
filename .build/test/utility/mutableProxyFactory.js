'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _lab = require('lab');

var _lab2 = _interopRequireDefault(_lab);

var _mutableProxyFactory3 = require('../../lib/utility/mutableProxyFactory');

var _mutableProxyFactory4 = _interopRequireDefault(_mutableProxyFactory3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lab = exports.lab = _lab2.default.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;


describe('mutableProxy', function () {
  it('should proxy a field access', function (done) {
    var _mutableProxyFactory = (0, _mutableProxyFactory4.default)();

    var proxy = _mutableProxyFactory.proxy;
    var setTarget = _mutableProxyFactory.setTarget;

    setTarget({ a: 1 });
    (0, _expect2.default)(proxy.a).toBe(1);
    done();
  });

  it('should proxy a function', function (done) {
    var _mutableProxyFactory2 = (0, _mutableProxyFactory4.default)();

    var proxy = _mutableProxyFactory2.proxy;
    var setTarget = _mutableProxyFactory2.setTarget;

    setTarget(function () {
      return 5;
    });
    (0, _expect2.default)(proxy()).toBe(5);
    done();
  });

  describe('after having changed target', function () {
    var changedProxy = void 0;
    var setTarget = void 0;

    beforeEach(function (done) {
      var controller = (0, _mutableProxyFactory4.default)();
      setTarget = controller.setTarget;
      setTarget({ q: 'quadriceps' });
      changedProxy = controller.proxy;
      done();
    });

    it('should proxy a field access', function (done) {
      setTarget({ a: 1 });
      (0, _expect2.default)(changedProxy.a).toBe(1);
      done();
    });

    it('should proxy a function', function (done) {
      setTarget(function () {
        return 5;
      });
      (0, _expect2.default)(changedProxy()).toBe(5);
      done();
    });
  });
});