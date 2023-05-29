import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class IsNaN implements IFunction<boolean> {
	id = 'isNaN';
	constructor(private readonly value: ICommand<string | number> | string | number) {}

	execute(): boolean {
		const evaluatedValue = isCommand(this.value) ? this.value.execute() : this.value;
		return isNaN(Number(evaluatedValue));
	}

	toString(): string {
		return `${this.id}(${isCommand(this.value) ? this.value.toString() : String(this.value)})`;
	}
}
