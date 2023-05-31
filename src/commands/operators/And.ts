import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

type BooleanType = boolean;
export default class And implements IOperator<boolean> {
	id = 'and';
	symbol = '&&';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);
	private operandsTypeGuard: TypeGuard = new TypeGuard(['boolean', 'array']);

	public operands: (ICommand<boolean> | boolean)[] | ICommand<boolean[]> | ICommand<boolean> | boolean;

	constructor(...operands: (ICommand<boolean> | boolean)[]);
	constructor(operands: ICommand<boolean[]>);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.operands = args[0] as ICommand<boolean[]> | ICommand<boolean> | boolean;
		} else {
			this.operands = args as (ICommand<boolean> | boolean)[];
		}
	}

	private async validateOperand(value: boolean, operandName: string): Promise<void> {
		console.log('Es: ', value);
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	private async validateOperands(value: unknown, operandName: string): Promise<void> {
		await this.operandsTypeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {

		console.log('Pre operands es: ', this.operands);
		const operands = isCommand(this.operands) ? await this.operands.execute(context) : this.operands;

		console.log('operands', operands);
		// console.log('Longitud es: ', this.operands.length);



		await this.validateOperands(operands, 'operands');
		if (Array.isArray(operands)) {
			console.log('Es array');
			for (let i = 0; i < operands.length; i++) {
				const operand = operands[i];
				const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
				await this.validateOperand(toEvaluate, `operands[${i}]`);
				if (!toEvaluate) {
					return false;
				}
			}
			return true;
		}
		return operands;
	}

	toString(): string {
		const str =
			isCommand(this.operands) || typeof this.operands === 'boolean'
				? this.operands.toString()
				: this.operands.map((e) => e.toString()).join(` ${this.symbol} `);
		return `(${str})`;
	}
}

// import IOperator from './IOperator';
// import ICommand, { isCommand } from '../ICommand';
// import { TypeGuard } from '../../utils';
// import { AbstractContextData } from '../../context';
// export default class And implements IOperator<boolean> {
// 	id = 'and';
// 	symbol = '&&';

// 	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

// 	public operands: (ICommand<boolean> | boolean)[] | ICommand<boolean[]>;

// 	constructor(...operands: (ICommand<boolean> | boolean)[]);
// 	constructor(operands: ICommand<boolean[]>);
// 	constructor(...args: unknown[]) {
// 		if (args.length === 1) {
// 			this.operands = args[0] as ICommand<boolean[]>;
// 		} else {
// 			this.operands = args as (ICommand<boolean> | boolean)[];
// 		}
// 	}

// 	private async validateOperand(value: boolean, operandName: string): Promise<void> {
// 		await this.typeGuard.evaluate(value, this.id, operandName);
// 	}

// 	async execute(context: AbstractContextData): Promise<boolean> {
// 		const operands = isCommand(this.operands) ? await this.operands.execute(context) : this.operands;

// 		for (let i = 0; i < operands.length; i++) {
// 			const operand = operands[i];
// 			const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
// 			await this.validateOperand(toEvaluate, `operands[${i}]`);
// 			if (!toEvaluate) {
// 				return false;
// 			}
// 		}
// 		return true;
// 	}

// 	toString(): string {
// 		const str = isCommand(this.operands)
// 			? this.operands.toString()
// 			: this.operands.map((e) => e.toString()).join(` ${this.symbol} `);
// 		return `(${str})`;
// 	}
// }
