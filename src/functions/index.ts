import { Constructor, FunctionMap } from '../types';
import IFunction from './IFunction';
import Upper from './Upper';

// hashMap
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functions: FunctionMap<any> = {};

export function getFunctions<T>(): {
	[key: string]: Constructor<IFunction<T>>;
} {
	return functions;
}

export function registerFunction<T, S extends Constructor<IFunction<T>>>(code: string) {
	return function (ctor: S): S {
		if (functions[code]) {
			throw new Error(`Function with code ${code} already registered.`);
		}
		functions[code] = ctor;
		return ctor;
	};
}

// Register functions
registerFunction('upper')(Upper);
