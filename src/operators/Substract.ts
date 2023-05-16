import IOperator from './IOperator';

export default class Subtract implements IOperator<number | Date> {
	left: number | Date;
	right: number | Date;
	constructor(left: number | Date, right: number | Date) {
		this.left = left;
		this.right = right;
	}
	execute(): number | Date {
		if (this.left instanceof Date && this.right instanceof Date) {
			return new Date(this.left.getDate() - this.right.getDate());
			// } else if (this.left instanceof Date && typeof this.right === 'number') {
			//     return new Date(this.left.getTime() - this.right);
		} else if (typeof this.left === 'number' && typeof this.right === 'number') {
			return this.left - this.right;
		}
		throw new Error('Invalid operands, must be the same type');
	}
}
