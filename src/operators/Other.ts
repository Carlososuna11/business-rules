import IOperator from './IOperator';

export default class Other<T> implements IOperator<boolean> {
	values: (T | IOperator<T> | boolean)[];

	constructor(...values: (T | IOperator<T>)[]) {
		this.values = values;
	}

	execute(): boolean {
		return this.values.reduce((prev, curr) => prev !== curr) != false;
	}
}
