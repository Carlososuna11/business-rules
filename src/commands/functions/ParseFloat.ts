import ICommand from '../ICommand';
import IFunction from './IFunction';

export default class ParseFloat implements IFunction<number> {
	id = 'parseFloat';
	constructor(private readonly value: ICommand<string> | string) {}

	execute(): number {
		const stringValue = typeof this.value === 'string' ? this.value : this.value.execute();
		return parseFloat(stringValue);
	}

	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
