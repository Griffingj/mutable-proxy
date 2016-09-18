module.exports = function mutableProxyFactory(defaultTarget) {
  let mutableHandler;
  let mutableTarget;

  function setTarget(target) {
    if (!(target instanceof Object)) {
      throw new Error(`Target "${target}" is not an object`);
    }
    mutableTarget = target;
  }

  function setHandler(handler) {
    Object.keys(handler).forEach(key => {
      const value = handler[key];

      if (typeof value !== 'function') {
        throw new Error(`Trap "${key}: ${value}" is not a function`);
      }

      if (!Reflect[key]) {
        throw new Error(`Trap "${key}: ${value}" is not a valid trap`);
      }
    });
    mutableHandler = handler;
  }

  if (defaultTarget) {
    setTarget(defaultTarget);
  }
  setHandler(Reflect);


  // Dynamically forward all the traps to the associated methods on the mutable handler
  const handler = new Proxy({}, {
    get(target, property) {
      return (...args) => {
        const patched = [mutableTarget].concat(...args.slice(1));
        return mutableHandler[property].apply(null, patched);
      };
    }
  });

  return {
    setTarget,
    setHandler,
    getTarget() {
      return mutableTarget;
    },
    getHandler() {
      return mutableHandler;
    },
    proxy: new Proxy(() => {}, handler)
  };
};
