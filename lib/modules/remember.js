const data = {};

export default (key) => {

  function store(value) {
    data[key] = value;
    return value;
  }

  function decorate(value) {
    return {
      [key]: data[key],
      value,
    };
  }

  return { store, decorate };

};
