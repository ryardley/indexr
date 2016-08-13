import curry from 'lodash/curry';

export default curry((config, value, next) => {
  const { template } = config;
  next(null, template(value));
});

