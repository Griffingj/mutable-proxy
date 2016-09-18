import mutableProxyFactory from '../index';

// The factory returns an object with the functions to control the proxy
const {
  setTarget,
  proxy
} = mutableProxyFactory();

// Set an object as target for the proxy
setTarget({ a: 'apple' });
console.log(proxy.a); // => 'apple'
console.log(Object.getPrototypeOf(proxy) === Object.prototype); // => 'true'

// Set an array as target for the proxy
setTarget(['a', 'b', 'c']);
console.log(proxy[1]); // => 'b'
console.log(Object.getPrototypeOf(proxy) === Array.prototype);// => 'true'

// Set a function as target for the proxy
setTarget(() => 5);
console.log(proxy()); // => '5'
console.log(Object.getPrototypeOf(proxy) === Function.prototype); // => 'true'


class Person {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `hi, my name is ${this.name}`;
  }
}

// Set an object with a custom prototype for the proxy
setTarget(new Person('John'));
console.log(proxy.speak()); // => 'hi, my name is John'
console.log(Object.getPrototypeOf(proxy)); // => 'Person {}'
