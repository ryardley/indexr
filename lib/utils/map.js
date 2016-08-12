import flow from 'lodash/flow';

export default (...fn) => (array) =>
  array.map(flow(...fn));
