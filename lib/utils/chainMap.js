import waterfall from 'async/waterfall';
import mapSeries from 'async/mapSeries';

export const chain = (...fns) => (...args) => {
  const lastArg = args.slice(-1)[0];
  const nextFunc = (typeof lastArg === 'function') ? lastArg : () => {};
  const initArgs = args.slice(0, -1);
  const waterFns = initArgs.length > 0 ? [(next) => next(undefined, ...initArgs)].concat(fns) : fns;
  waterfall(waterFns, nextFunc);
};

export const map = (...fns) => (collection, done) => {
  const iteree = (val, next) => chain(...fns)(val, (err, out) => next(null, out));
  mapSeries(collection, iteree, done);
};
