'use strict';

var _containerFactory = require('../lib/containerFactory');

var _containerFactory2 = _interopRequireDefault(_containerFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var container = (0, _containerFactory2.default)();

// Store a value directly
/* eslint no-console: 0 */
container.register({
  key: 'a',
  value: 'apple'
});

// Store the value returned from a factory function
function bananaFactory() {
  var banana = {
    source: 'banana'
  };
  // The value other components may depend on
  return banana;
}

container.register({
  key: 'b',
  factory: bananaFactory
});

// Store the value returned from using the new operator on a constructor function
function Coconut(dependency) {
  this.dependency = dependency;
}

Coconut.prototype = {
  message: function message() {
    return 'I am a coconut and contain a ' + this.dependency;
  }
};

container.register({
  key: 'c',
  constructorFunc: Coconut,
  requirements: ['a']
});

// Store the value from a factory which takes a node-style callback as the last
// argument
function formatterFactory(a, b, c, callback) {
  var value = {
    toString: function toString() {
      return 'I am a formatter and I depend on these ' + ('"' + JSON.stringify({ a: a, b: b, c: c }) + '", c.message() is "' + c.message() + '"');
    }
  };
  setTimeout(function () {
    return callback(null, value);
  }, 500);
}

container.register({
  key: 'formatter',
  factoryWithCallback: formatterFactory,
  requirements: ['a', 'b', 'c']
});

// Store the resolved value from a factory that returns a promise, some clearer
// interface abstraction in this example
function printerFactory(formatter, logable) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      var value = {
        print: function print() {
          logable.log(formatter.toString());
        }
      };
      resolve(value);
    }, 500);
  });
}

container.register({
  key: 'logger',
  value: console
});

container.register({
  key: 'printer',
  factoryResolvePromise: printerFactory,
  requirements: ['formatter', 'logger']
});

// Resolve dependencies lazily
container.resolve('printer').then(function (printer) {
  return printer.print();
}).catch(function (error) {
  return console.log(error.stack);
});
// => I am a formatter and I depend on these "{"a":"apple","b":{"source":"banana"},"c":{"dependency":"apple"}}", c.message() is "I am a coconut and contain a apple"