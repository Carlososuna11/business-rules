import IOperator from './IOperator';

export default class Remainder implements IOperator<number> {
	left: number;
	right: number;
	constructor(left: number, right: number) {
		this.left = left;
		this.right = right;
	}
	execute(): number {
		return this.left % this.right;
	}
}
