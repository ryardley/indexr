import curry from 'lodash/curry';

// Implement whatever template function is stored in config
export default curry((config, value, next) => {
  const { template, namedExports } = config;
  next(null, template(value, { namedExports }));
});

