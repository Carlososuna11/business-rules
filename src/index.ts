import { getOperators } from './operators';

const operators = getOperators();

const And = operators['and'];
const Or = operators['or'];
const Not = operators['not'];
const Xor = operators['xor'];
const Eq = operators['eq'];

// test operator

console.log('AND: ', new And(true, new Or(true, false)).execute());

console.log('OR: ', new Or(false, true).execute());

console.log('NOT:', new Not(true, true).execute());

console.log('XOR:', new Xor(true, false, true, false, true).execute());

console.log('EQ:', new Eq(true, true, true).execute());
console.log('EQ:', new Eq('1', 1).execute());
