"use strict";
const promiseConstr = typeof Promise !== 'undefined' ? Promise : require('es6-promise').Promise;
module.exports = promiseConstr;
