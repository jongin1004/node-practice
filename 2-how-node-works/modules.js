// console.log(arguments);

// module.exports
const c = require('./test-module');

const cal = new c();
console.log(cal.add(2, 5));

// exports
const c1 = require('./test-module-2');
console.log(c1.add(2, 5));

// caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();