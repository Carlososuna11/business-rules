import { Constructor } from '../../types';
import IFunction from './IFunction';
import Upper from './Upper';

// hashMap
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functions: { [key: string]: Constructor<IFunction<unknown>> } = {};

function getFunctions(): {
	[key: string]: Constructor<IFunction<unknown>>;
} {
	return functions;
}

function registerFunction(id: string, _function: Constructor<IFunction<unknown>>): void {
	if (functions[id]) {
		throw new Error(`Function with id ${id} already registered.`);
	}
	functions[id] = _function;
}

registerFunction('upper', Upper);

export { IFunction, getFunctions, registerFunction };
