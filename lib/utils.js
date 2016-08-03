export const truthy = (a) => !!a;
export const ensureArray = (a) => Array.isArray(a) ? a : [a];
export const stripArray = (a) => Array.isArray(a) && a.length === 1 ? a[0] : a;
export const trimTrailingSlash = (str) => str.replace(/\/$/, '');
