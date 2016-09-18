'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mutableProxyFactory;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var mutableTarget = void 0;
var targetSet = false;

function setTarget(target) {
  if (!(target instanceof Object)) {
    throw new Error('Target "' + target + '" is not an object');
  }
  mutableTarget = target;
}

function mutableProxyFactory() {
  setTarget(function () {});

  // Dynamically forward all the traps to the associated methods on Reflect
  var handler = new Proxy({}, {
    get: function get(target, property) {
      if (!targetSet) {
        throw Error('Placeholder accessed before forwarding setup');
      }
      return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return Reflect[property].apply(null, [mutableTarget].concat(_toConsumableArray(args.slice(1))));
      };
    }
  });

  return {
    set target(target) {
      targetSet = true;
      setTarget(target);
    },
    proxy: new Proxy(mutableTarget, handler)
  };
}