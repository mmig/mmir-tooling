
const promiseConstr = typeof Promise !== 'undefined'? Promise : require('es6-promise').Promise;

export =  promiseConstr as typeof Promise;
