'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateRegistration;

var _assert = require('../utility/assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validateRegistration(registration) {
  var key = registration.key;
  var value = registration.value;
  var factory = registration.factory;
  var constructorFunc = registration.constructorFunc;
  var factoryWithCallback = registration.factoryWithCallback;
  var factoryResolvePromise = registration.factoryResolvePromise;
  var requirements = registration.requirements;


  var prefix = 'Registration "' + JSON.stringify(registration) + '" invalid,';

  (0, _assert2.default)(key, prefix + ' key required');

  var provider = [value, factory, factoryWithCallback, factoryResolvePromise, constructorFunc].filter(function (item) {
    return item !== undefined;
  })[0];

  (0, _assert2.default)(provider, prefix + ' one of [value, factory, constructor,' + ' factoryWithCallback, factoryResolvePromise] required');

  var valueNoReqs = !(value && requirements && requirements.length);
  (0, _assert2.default)(valueNoReqs, prefix + ' do not pass requirements when registering value');

  var funcProviderIsFunc = provider === value || typeof provider === 'function';
  (0, _assert2.default)(funcProviderIsFunc, prefix + ' [factory, constructor,' + 'factoryWithCallback, factoryResolvePromise] must be functions');
}