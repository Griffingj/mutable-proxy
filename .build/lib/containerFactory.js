'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = containerFactory;

var _validateRegistration = require('./validation/validateRegistration');

var _validateRegistration2 = _interopRequireDefault(_validateRegistration);

var _placeholderProxyFactory = require('./utility/placeholderProxyFactory');

var _placeholderProxyFactory2 = _interopRequireDefault(_placeholderProxyFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function containerFactory() {
  var registry = new Map();

  function fulfill(dependencies, registration) {
    var factory = registration.factory;
    var factoryWithCallback = registration.factoryWithCallback;
    var factoryResolvePromise = registration.factoryResolvePromise;
    var constructorFunc = registration.constructorFunc;


    if (factory) {
      try {
        return factory.apply(undefined, _toConsumableArray(dependencies));
      } catch (error) {
        return Promise.reject(error);
      }
    }

    if (factoryWithCallback) {
      return new Promise(function (resolve, reject) {
        factoryWithCallback.apply(undefined, _toConsumableArray(dependencies).concat([function (error, component) {
          if (error) {
            reject(error);
            return;
          }
          resolve(component);
        }]));
      });
    }

    if (factoryResolvePromise) {
      return factoryResolvePromise.apply(undefined, _toConsumableArray(dependencies));
    }

    try {
      /* eslint new-cap: 0 */
      return new (Function.prototype.bind.apply(constructorFunc, [null].concat(_toConsumableArray(dependencies))))();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function resolveChildren(key, circularRefs) {
    var ancestry = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

    var registration = registry.get(key);

    if (!registration) {
      var keyError = new Error('Key "' + key + '" not found in registry');
      return Promise.reject(keyError);
    }

    var value = registration.value;
    var _registration$require = registration.requirements;
    var requirements = _registration$require === undefined ? [] : _registration$require;
    var resolver = registration.resolver;

    // If some other call to resolveChildren had already started the
    // resolution of this key, return that promise

    if (resolver) {
      return resolver;
    }

    if (value) {
      return Promise.resolve(value);
    }

    // Resolve the dependencies of this key
    var dependencyPromises = requirements.map(function (requirement) {
      // Return a proxy for circular dependencies, this will be patched after
      // the dependencies are resolved, otherwise the dependencies would never
      // resolve
      var isCircular = ancestry.indexOf(requirement) !== -1;

      if (isCircular) {
        var _mutableProxyFactory = mutableProxyFactory();

        var proxy = _mutableProxyFactory.proxy;
        var setTarget = _mutableProxyFactory.setTarget;

        circularRefs.set(requirement, setTarget);
        return proxy;
      }
      return resolveChildren(requirement, circularRefs, [].concat(_toConsumableArray(ancestry), [key]));
    });

    var valuePromise = Promise.all(dependencyPromises).then(function (dependencies) {
      return fulfill(dependencies, registration);
    });

    // Add the promise to the registry's registration so that other async
    // calls to resolve this key reuse this promise
    registry.set(key, Object.assign(registration, {
      resolver: valuePromise
    }));

    return valuePromise;
  }

  return {
    register: function register(registration) {
      (0, _validateRegistration2.default)(registration);
      registry.set(registration.key, registration);
      return this;
    },
    resolve: function resolve(key) {
      var circularRefs = new Map();

      return resolveChildren(key, circularRefs).then(function (value) {
        circularRefs.forEach(function (setProxyTarget, proxyKey) {
          registry.get(proxyKey).resolver.then(setProxyTarget);
        });
        return value;
      });
    },
    delete: function _delete(key) {
      // TODO Warn if other's depend on this
      return registry.delete(key);
    },
    toJson: function toJson() {
      return JSON.stringifiy(registry);
    }
  };
}