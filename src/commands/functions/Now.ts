import IFunction from './IFunction';
import { AbstractContextData } from '../../context';

export default class Now implements IFunction<Date> {
	id = 'now';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(context: AbstractContextData): Promise<Date> {
		return new Date();
	}

	toString(): string {
		return `${this.id}()`;
	}
}
