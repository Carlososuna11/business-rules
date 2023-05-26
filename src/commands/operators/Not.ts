import ICommand from '../ICommand';
import IOperator from './IOperator';

export default class Not implements IOperator<boolean> {
	symbol = '!';
	id = 'not';

	constructor(public operand: boolean | ICommand<boolean>) {}

	public execute(): boolean {
		return typeof this.operand === 'boolean' ? !this.operand : !this.operand.execute();
	}

	public toString(): string {
		return `${this.symbol}(${this.operand.toString()})`;
	}
}
