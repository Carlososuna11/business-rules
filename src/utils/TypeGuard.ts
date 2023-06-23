import { isCommand } from '../commands';
import { TypeGuardsOptions } from '../types';
import { BusinessRulesException } from '../exceptions';

/**
 * Type guard for string values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not a string
 * @returns Whether the value is a string or not
 * @throws BusinessRulesException if raiseException is true and the value is not a string
 */
export function isStringTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'string') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected string, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for number values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not a number
 * @returns Whether the value is a number or not
 * @throws BusinessRulesException if raiseException is true and the value is not a number
 */
export function isNumberTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'number') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected number, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for boolean values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not a boolean
 * @returns Whether the value is a boolean or not
 * @throws BusinessRulesException if raiseException is true and the value is not a boolean
 */
export function isBooleanTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'boolean') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected boolean, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for object values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not an object
 * @returns Whether the value is an object or not
 * @throws BusinessRulesException if raiseException is true and the value is not an object
 */
export function isObjectTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'object') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected object, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for array values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not an array
 * @returns Whether the value is an array or not
 * @throws BusinessRulesException if raiseException is true and the value is not an array
 */
export function isArrayTypeGuard(value: unknown, raiseException = false): boolean {
	if (Array.isArray(value)) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected array, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for function values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not a function
 * @returns Whether the value is a function or not
 * @throws BusinessRulesException if raiseException is true and the value is not a function
 */
export function isFunctionTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'function') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected function, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for null values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not null
 * @returns Whether the value is null or not
 * @throws BusinessRulesException if raiseException is true and the value is not null
 */
export function isNullTypeGuard(value: unknown, raiseException = false): boolean {
	if (value === null) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected null, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for undefined values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not undefined
 * @returns Whether the value is undefined or not
 * @throws BusinessRulesException if raiseException is true and the value is not undefined
 */
export function isUndefinedTypeGuard(value: unknown, raiseException = false): boolean {
	if (value === undefined) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected undefined, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for symbol values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not a symbol
 * @returns Whether the value is a symbol or not
 * @throws BusinessRulesException if raiseException is true and the value is not a symbol
 */
export function isSymbolTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'symbol') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected symbol, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for date values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not a Date object
 * @returns Whether the value is a Date object or not
 * @throws BusinessRulesException if raiseException is true and the value is not a Date object
 */
export function isDateTypeGuard(value: unknown, raiseException = false): boolean {
	if (value instanceof Date) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected date, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for ICommand values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not an ICommand object
 * @returns Whether the value is an ICommand object or not
 * @throws BusinessRulesException if raiseException is true and the value is not an ICommand object
 */
export function isCommandTypeGuard(value: unknown, raiseException = false): boolean {
	if (isCommand(value)) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected ICommand, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for Map values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not a Map object
 * @returns Whether the value is a Map object or not
 * @throws BusinessRulesException if raiseException is true and the value is not a Map object
 */
export function isMapTypeGuard(value: unknown, raiseException = false): boolean {
	if (value instanceof Map) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected Map, got ${typeof value}`);
	}
	return false;
}

/**
 * Type guard for Set values
 * @param value - The value to evaluate
 * @param raiseException - Whether to raise an exception if the value is not a Set object
 * @returns Whether the value is a Set object or not
 * @throws BusinessRulesException if raiseException is true and the value is not a Set object
 */
export function isSetTypeGuard(value: unknown, raiseException = false): boolean {
	if (value instanceof Set) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected Set, got ${typeof value}`);
	}
	return false;
}

export default class TypeGuard {
	/**
	 * Default type guards
	 */
	static defaultTypeGuards: Record<string, CallableFunction> = {
		string: isStringTypeGuard,
		number: isNumberTypeGuard,
		boolean: isBooleanTypeGuard,
		object: isObjectTypeGuard,
		array: isArrayTypeGuard,
		function: isFunctionTypeGuard,
		null: isNullTypeGuard,
		undefined: isUndefinedTypeGuard,
		symbol: isSymbolTypeGuard,
		date: isDateTypeGuard,
		command: isCommandTypeGuard,
		map: isMapTypeGuard,
		set: isSetTypeGuard,
	};

	/**
	 * TypeGuard class constructor
	 * @param someTypeGuard - An array of type guards to evaluate the value against
	 * @param raiseException - Whether to raise an exception if the value does not pass any of the type guards
	 * @param extraTypeGuardsFunctions - Extra type guard functions to include in the evaluation
	 */
	constructor(
		public someTypeGuard: (TypeGuardsOptions | string)[] = [],
		public raiseException = true,
		public extraTypeGuardsFunctions: Record<string, CallableFunction> = {}
	) {
		if (someTypeGuard.length === 0) {
			throw new BusinessRulesException('Expected at least one type guard');
		}
	}

	/**
	 * Evaluates a value against the type guards
	 * @param value - The value to evaluate
	 * @param commandName - The name of the command being evaluated
	 * @param keyName - The name of the key being evaluated
	 * @returns Whether the value passes any of the type guards or not
	 * @throws BusinessRulesException if raiseException is true and the value doesn't pass any of the type guards
	 */
	async evaluate(value: unknown, commandName: string, keyName: string): Promise<boolean> {
		const results = await Promise.all(
			this.someTypeGuard.map(async (typeGuard) => {
				if (typeGuard in TypeGuard.defaultTypeGuards) {
					return Promise.resolve(TypeGuard.defaultTypeGuards[typeGuard](value));
				}
				if (typeGuard in this.extraTypeGuardsFunctions) {
					return Promise.resolve(this.extraTypeGuardsFunctions[typeGuard](value));
				}
			})
		);

		const result = results.some((result) => result === true);

		if (!result && this.raiseException) {
			throw new BusinessRulesException(
				`On ${commandName} command, ${keyName} key, expected ${this.someTypeGuard.join(' or ')}, got ${typeof value}`
			);
		}

		return result;
	}
}
