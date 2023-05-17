import IOperator from './IOperator';

export default class LessThanOrEqual implements IOperator<boolean> {
	left: number;
	right: number;
	constructor(left: number, right: number) {
		this.left = left;
		this.right = right;
	}
	execute(): boolean {
		return this.left <= this.right;
	}
}
