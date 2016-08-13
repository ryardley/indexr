import curry from 'lodash/curry';

export const toTemplate = curry((config, value, next) => {
  const { template } = config;
  next(null, template(value));
});

export default { toTemplate };
