import ICommand from '../ICommand';
import IFunction from './IFunction';

export default class ParseInt implements IFunction<number> {
	id = 'parseInt';
	constructor(private readonly value: ICommand<string> | string) {}

	execute(): number {
		const stringValue = typeof this.value === 'string' ? this.value : this.value.execute();
		return parseInt(stringValue);
	}

	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
