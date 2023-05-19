import IOperator from './IOperator';

export default class IsNull<T> implements IOperator<boolean> {
	operators: T | IOperator<T> | (T | IOperator<T>)[];
	constructor(operators: T | IOperator<T> | (T | IOperator<T>)[]) {
		this.operators = operators;
	}

	execute(): boolean {
		if (Array.isArray(this.operators)) {
			// Si se le pasó una lista de elementos
			return this.operators.every((element) => element === null);
		} else {
			// Si se le pasó un solo elemento
			return this.operators === null;
		}
	}
}
// execute(): boolean {

// 	return this.operators.every((operator) => {
// 		return typeof operator === null ? operator : operator.execute() === null;
// 	});
// }

// if (this.operators instanceof Array) {
// 	return this.operators.every((val) => {
// 		if (val instanceof IOperator) {
// 			return val.execute() === null;
// 		} else {
// 			return val === null;
// 		}
// 	});
// } else {
// 	if (this.operators instanceof IOperator) {
// 		return this.operators.execute() === null;
// 	} else {
// 		return this.operators === null;
// 	}
// }
