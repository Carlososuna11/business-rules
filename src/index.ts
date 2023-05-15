import { getOperators } from './operators';

const operators = getOperators();

const And = operators['and'];
const Or = operators['or'];

// test operator

console.log(new And(true, true).execute());
console.log(new And(true, false).execute());

console.log(new Or(true, true).execute());
console.log(new Or(true, false).execute());
