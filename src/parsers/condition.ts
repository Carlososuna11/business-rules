import { getOperators, getFunctions, getContextMethods, ICommand } from '../commands';
import { ExpressionOptions } from '../types';
import { BusinessRulesException } from '../exceptions';

// Composite pattern
export const parseCondition = (conditionStructure: object): ICommand<boolean> => {
	const options: ExpressionOptions = {
		$op: getOperators(),
		$fn: getFunctions(),
		$ctx: getContextMethods(),
	};

	const parseExpression = (expression: object): ICommand<unknown> | object => {
		const entries = Object.entries(expression);
		if (!entries.length) return expression;

		const [token, args] = entries[0];
		const [type, name] = token.split('.');

		if (!options[type]) return expression;
		if (!options[type][name]) {
			throw new BusinessRulesException(`Unknown ${type}: ${name}`);
		}
		// if args is not an array, raise an error
		if (!Array.isArray(args)) {
			throw new BusinessRulesException(`Arguments for ${token} must be an array`);
		}

		const Class = options[type][name];
		const subExpressions = (args as unknown[]).map((arg: unknown) => {
			// if (Array.isArray(arg))
			// 	return arg.map((subArg) => (typeof subArg === 'object' ? parseExpression(subArg) : subArg));
			if (typeof arg === 'object' && arg) return parseExpression(arg);
			return arg;
		});
		return new Class(...subExpressions);
	};

	return parseExpression(conditionStructure) as ICommand<boolean>;
};

export default parseCondition;
