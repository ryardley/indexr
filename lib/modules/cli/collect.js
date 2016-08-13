export default (item, memo) => {
  const memoInit = memo || [];
  memoInit.push(item);
  return memoInit;
};
