const data = {};

export default (key) => {

  const decorator = (val) => ({
    [key]: data[key],
    value: val,
  });

  function store(value, next) {
    data[key] = value;
    next(null, value);
  }

  function decorate(func) {
    return (...args) => {
      const firstArg = args[0];
      const rest = args.slice(1);
      return func(decorator(firstArg), ...rest);
    };
  }

  return { store, decorate };

};
