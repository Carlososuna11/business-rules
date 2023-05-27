import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class StandardDesviation implements IFunction<number> {
	id = 'standardDesviation';
	constructor(private readonly values: (ICommand<number | string> | number | string)[]) {}

	execute(): number {
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));
		const media =
			Number(transformedValues.reduce((sum, value) => Number(sum) + Number(value), 0)) / transformedValues.length;

		const sumSquaresDifferences = transformedValues.reduce(
			(sum, value) => Number(sum) + Math.pow(Number(value) - media, 2),
			0
		);

		const standarDesviation = Math.sqrt(Number(sumSquaresDifferences) / transformedValues.length);

		return standarDesviation;
	}

	toString(): string {
		return `${this.id}(${this.values.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
