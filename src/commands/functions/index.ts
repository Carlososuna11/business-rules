import { Constructor } from '../../types';
import IFunction from './IFunction';

// hashMap
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functions: { [key: string]: Constructor<IFunction<unknown>> } = {};

function getFunctions(): {
	[key: string]: Constructor<IFunction<unknown>>;
} {
	return functions;
}

function registerFunction<T extends Constructor<IFunction<unknown>>>(code: string) {
	return function (ctor: T): T {
		if (functions[code]) {
			throw new Error(`Function with code ${code} already registered.`);
		}
		functions[code] = ctor;
		return ctor;
	};
}

export { IFunction, getFunctions, registerFunction };
