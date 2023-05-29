import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';
import IsNaN from './IsNaN';

export default class Average implements IFunction<number> {
	id = 'average';

	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	constructor(private readonly operands: (ICommand<number | string> | number | string)[]) {}

	private validateValue(value: number | string, operandName: string): void {
		this.typeGuard.evaluate(value, this.id, operandName);
	}

	execute(): number {
		let sum = 0;
		let count = 0;

		for (let i = 0; i < this.operands.length; i++) {
			const operand = this.operands[i];
			const toEvaluate = isCommand(operand) ? operand.execute() : operand;
			this.validateValue(toEvaluate, `values[${i}]`);

			if (isNaN(Number(toEvaluate))) {
				throw new ValueException(this.id, `The value '${toEvaluate}' is not a valid number.`);
			}
			sum += Number(toEvaluate);
			count++;
		}

		return sum / count;
	}

	toString(): string {
		const str = this.operands
			.map((operand) => {
				return typeof operand === 'boolean' ? operand : operand.toString();
			})
			.join(', ');
		return `(${str})`;
		// return `${this.id}(${this.operands.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
