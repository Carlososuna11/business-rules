import { getOperators } from './commands/operators';
import Addition from './commands/operators/Addition';
import Between from './commands/operators/Between';
import Like from './commands/operators/Like';

import { parseAction, parseCondition } from './parsers';

const operators = getOperators();

// console.log('OPERATORS: ', operators);

// // test operator

// const currentDate = new Date();
// const startDate = new Date('2021-01-01');
// const endDate = new Date('2024-01-31');

// const betweenOp = new Between<Date>(currentDate, startDate, endDate);
// console.log(betweenOp.execute()); // depende de la fecha actual

// const expression = 'Hola mundo';
// const pattern = 'Ho';

// const likeOperator = new Like(expression, pattern, 'BEGIN');

// console.log(likeOperator.execute()); // true

// const expression2 = 'Hola mundo';
// const pattern2 = 'mu';

// const likeOperator2 = new Like(expression2, pattern2, 'END');

// console.log(likeOperator2.execute()); // false

// console.log('AND: ', new And(true, new Or(true, false)).execute());

// console.log('OR: ', new Or(false, true).execute());

// console.log('NOT:', new Not(false, true, false).execute());

// console.log('XOR:', new Xor(true, false, true, false, true).execute());

// console.log('EQ:', new Equal(true, true, true).execute());

// console.log('GT:', new GreaterThan(3, 2).execute());

// console.log('LT:', new LessThan(2, 3).execute());

// console.log('CON:', new Contains([1, '4', true], '4').execute());

// console.log('SUB:', new Substract(5, 3).execute());

// console.log('SUB:', new Substract(new Date('01-01-2021'), new Date('01-02-2021')).execute());

// console.log('ADDITION:', new Addition('2', 1).execute());

// console.log('GTE:', new GreatherEqualThan(2, 3).execute());

// console.log('LTE:', new LessEqualThan(2, 3).execute());

// console.log('OTHER:', new Other(false, false, true).execute());

// console.log('MULTIPLY:', new Multiply(2.5, -3).execute());

// console.log('DIVIDE:', new Divide(3, -3).execute());

// console.log('REMAINDER:', new Remainder(6, 3).execute());

// console.log('ROOT:', new Root(16, 4).execute());

// console.log('EXPONENTIATION:', new Exponentiation(3, 3).execute());

// console.log('IS NULL:', new IsNull(2, null).execute());

const data = {
	user: {
		name: 'John',
		age: 19,
		cars: ['Ford', 'BMW', 'Fiat'],
	},
};

const condition = {
	'$op.and': [
		{
			'$op.equal': [
				{
					'$ctx.get': ['user.name'],
				},
				'John',
			],
		},
		{
			'$op.greaterThan': [
				{
					'$ctx.get': ['user.age'],
				},
				18,
			],
		},
	],
};

const action = {
	'$ctx.set': ['user.age', 50],
};

const conditionResult = parseCondition(data, condition);

// console.log('CONDITION RESULT: ', conditionResult.execute());

if (conditionResult.execute()) {
	const actionResult = parseAction(data, action);

	// console.log('ACTION RESULT: ', actionResult.execute());
}

// console.log('DATA: ', data);
