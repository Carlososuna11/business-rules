import { ValueException } from '../../exceptions';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Trunc implements IFunction<number> {
	id = 'trunc';

	constructor(private readonly value: ICommand<number | string> | number | string) {}

	execute(): number {
		const transformedValue = isCommand(this.value) ? this.value.execute() : this.value;

		if (isNaN(Number(transformedValue))) {
			throw new ValueException(this.id, 'Value must be a number or a string representing a number');
		}
		return Math.trunc(Number(transformedValue));
	}

	toString(): string {
		return `${this.id}(${isCommand(this.value) ? this.value.toString() : String(this.value)})`;
	}
}
