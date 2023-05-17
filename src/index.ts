import { getOperators } from './operators';

const operators = getOperators();

const And = operators['and'];
const Or = operators['or'];
const Not = operators['not'];
const Xor = operators['xor'];
const Equal = operators['equal'];
const GreaterThan = operators['gretaterThan'];
const LessThan = operators['lessThan'];
const Contains = operators['contains'];
const Substract = operators['substract'];
const Sum = operators['sum'];
const GreatherEqualThan = operators['greatherEqualThan'];
const LessEqualThan = operators['lessEqualThan'];
const Other = operators['other'];

// test operator

console.log('AND: ', new And(true, new Or(true, false)).execute());

console.log('OR: ', new Or(false, true).execute());

console.log('NOT:', new Not(false, true, false).execute());

console.log('XOR:', new Xor(true, false, true, false, true).execute());

console.log('EQ:', new Equal(true, true, true).execute());
// console.log('EQ:', new Eq('1', 1).execute());

console.log('GT:', new GreaterThan(3, 2).execute());

console.log('LT:', new LessThan(2, 3).execute());

console.log('CON:', new Contains([1, '4', true], '4').execute());

console.log('SUB:', new Substract(5, 3).execute());

console.log('SUB:', new Substract(new Date('01-01-2021'), new Date('01-02-2021')).execute());

console.log('SUM:', new Sum(-2, 3).execute());

console.log('GTE:', new GreatherEqualThan(2, 3).execute());

console.log('LTE:', new LessEqualThan(2, 3).execute());

console.log('OTHER:', new Other(false, false, true).execute());
