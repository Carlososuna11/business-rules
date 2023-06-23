import { getOperators, getFunctions, getContextMethods, ICommand } from '../commands';
import { ExpressionOptions } from '../types';
import { BusinessRulesException } from '../exceptions';

// Composite pattern
/**
 * Parses an action structure into a ICommand object or returns the original object if it cannot be parsed
 * @param actionStructure - The structure of the action to be parsed
 * @returns The parsed ICommand object or the original object if it cannot be parsed
 * @throws {BusinessRulesException} If an unknown type is encountered in the action structure
 * @throws {BusinessRulesException} If the arguments for a token are not in an array format
 */
const parseAction = (actionStructure: object): ICommand<unknown> => {
	// An options object that contains the supported operators, functions and context methods
	const options: ExpressionOptions = {
		$op: getOperators(),
		$fn: getFunctions(),
		$ctx: getContextMethods(),
	};

	/**
	 * Parses an expression object into an ICommand object or returns the original object if it cannot be parsed
	 * @param expression - The expression object to be parsed
	 * @returns The parsed ICommand object or the original object if it cannot be parsed
	 * @throws {BusinessRulesException} If an unknown type is encountered in the expression object
	 * @throws {BusinessRulesException} If the arguments for a token are not in an array format
	 */
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
			if (typeof arg === 'object' && arg) return parseExpression(arg);
			return arg;
		});
		return new Class(...subExpressions);
	};

	return parseExpression(actionStructure) as ICommand<unknown>;
};

export default parseAction;
