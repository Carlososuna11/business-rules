import IFunction from './IFunction';
import ICommand from '../ICommand';

export default class Lower implements IFunction<string> {
	id = 'lower';
	constructor(private readonly value: ICommand<string> | string) {}

	execute(): string {
		return typeof this.value === 'string' ? this.value.toLowerCase() : this.value.execute().toLowerCase();
	}

	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
