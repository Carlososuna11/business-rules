import { getOperators } from './operators';

const operators = getOperators();

const And = operators['and'];
const Or = operators['or'];
const Not = operators['not'];
const Xor = operators['xor'];
const Eq = operators['equal'];
const GT = operators['gretaterThan'];
const LT = operators['lessThan'];

// test operator

console.log('AND: ', new And(true, new Or(true, false)).execute());

console.log('OR: ', new Or(false, true).execute());

console.log('NOT:', new Not(false, true, false).execute());

console.log('XOR:', new Xor(true, false, true, false, true).execute());

console.log('EQ:', new Eq(true, true, true).execute());
// console.log('EQ:', new Eq('1', 1).execute());

console.log('GT:', new GT(3, 2).execute());

console.log('LT:', new LT(2, 3).execute());