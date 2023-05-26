import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Length<T> implements IFunction<number> {
	id = 'length';
	constructor(private readonly values: (ICommand<T> | T)[]) {}

	execute(): number {
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		return transformedValues.length;
	}
}
