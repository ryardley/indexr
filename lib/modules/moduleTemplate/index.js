import curry from 'lodash/curry';

function moduleTemplate(config, value, next) {
  const { template } = config;
  next(null, template(value));
}

export default curry(moduleTemplate);
