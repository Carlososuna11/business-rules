import { isCommand } from '../commands';
import { TypeGuardsOptions } from '../types';
import { BusinessRulesException } from '../exceptions';

// string type guard
export function isStringTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'string') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected string, got ${typeof value}`);
	}
	return false;
}

// number type guard
export function isNumberTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'number') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected number, got ${typeof value}`);
	}
	return false;
}

// boolean type guard
export function isBooleanTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'boolean') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected boolean, got ${typeof value}`);
	}
	return false;
}

// object type guard
export function isObjectTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'object') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected object, got ${typeof value}`);
	}
	return false;
}

// array type guard
export function isArrayTypeGuard(value: unknown, raiseException = false): boolean {
	if (Array.isArray(value)) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected array, got ${typeof value}`);
	}
	return false;
}

// function type guard
export function isFunctionTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'function') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected function, got ${typeof value}`);
	}
	return false;
}

// null type guard
export function isNullTypeGuard(value: unknown, raiseException = false): boolean {
	if (value === null) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected null, got ${typeof value}`);
	}
	return false;
}

// undefined type guard
export function isUndefinedTypeGuard(value: unknown, raiseException = false): boolean {
	if (value === undefined) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected undefined, got ${typeof value}`);
	}
	return false;
}

// symbol type guard
export function isSymbolTypeGuard(value: unknown, raiseException = false): boolean {
	if (typeof value === 'symbol') {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected symbol, got ${typeof value}`);
	}
	return false;
}

// date type guard
export function isDateTypeGuard(value: unknown, raiseException = false): boolean {
	if (value instanceof Date) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected date, got ${typeof value}`);
	}
	return false;
}

// type guard for ICommand
export function isCommandTypeGuard(value: unknown, raiseException = false): boolean {
	if (isCommand(value)) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected ICommand, got ${typeof value}`);
	}
	return false;
}

// type guard Map
export function isMapTypeGuard(value: unknown, raiseException = false): boolean {
	if (value instanceof Map) {
		return true;
	}
	if (raiseException) {
		throw new BusinessRulesException(`Expected Map, got ${typeof value}`);
	}
	return false;
}

// type guard Set
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

	constructor(
		public someTypeGuard: (TypeGuardsOptions | string)[] = [],
		public raiseException = true,
		public extraTypeGuardsFunctions: Record<string, CallableFunction> = {}
	) {
		if (someTypeGuard.length === 0) {
			throw new BusinessRulesException('Expected at least one type guard');
		}
	}

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
