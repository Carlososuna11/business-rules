import IFuntion from './IFunction';
import ICommand from '../ICommand';

export default class Lower implements IFuntion<string> {
	id = 'lower';
	constructor(private readonly value: ICommand<string> | string) {}

	execute(): string {
		return typeof this.value === 'string' ? this.value.toLowerCase() : this.value.execute().toLowerCase();
	}
}
