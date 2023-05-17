import IOperator from './IOperator';

export default class Root implements IOperator<number> {
    radicand: number;
	index: number;
	constructor(radicand: number, index: number) {
		this.index = index;
		this.radicand = radicand;
	}
	execute(): number {
		return Math.pow(this.radicand, (1 / this.index));
	}
}
