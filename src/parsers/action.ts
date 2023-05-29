import { getOperators, getFunctions, getContextMethods, ICommand } from '../commands';
import { ExpressionOptions } from '../types';

// Composite pattern
const parseAction = (actionStructure: object): ICommand<unknown> => {
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
			throw new Error(`Unknown ${type}: ${name}`);
		}
		// if args is not an array, raise an error
		if (!Array.isArray(args)) {
			throw new Error(`Arguments for ${token} must be an array`);
		}

		const Class = options[type][name];
		const subExpressions = (args as object[]).map((arg: unknown) => {
			return typeof arg === 'object' && arg ? parseExpression(arg) : arg;
		});
		return new Class(...subExpressions);
	};

	return parseExpression(actionStructure) as ICommand<unknown>;
};

export default parseAction;
