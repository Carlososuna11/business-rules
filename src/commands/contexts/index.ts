import { Constructor } from '../../types';
import IContext from './IContext';

// Operators hashMap
const contextMethods: { [key: string]: Constructor<IContext<unknown>> } = {};

function getContextMethods(): {
	[key: string]: Constructor<IContext<unknown>>;
} {
	return contextMethods;
}

function registerContextMethod<T extends Constructor<IContext<unknown>>>(code: string) {
	return function (ctor: T): T {
		if (contextMethods[code]) {
			throw new Error(`Context Method with code ${code} already registered.`);
		}
		contextMethods[code] = ctor;
		return ctor;
	};
}

export { IContext, getContextMethods, registerContextMethod };
