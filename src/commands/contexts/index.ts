import { Constructor } from '../../types';
import IContext from './IContext';
import Get from './get';
import Set from './set';

// Operators hashMap
const contextMethods: { [key: string]: Constructor<IContext<unknown>> } = {};

function getContextMethods(): {
	[key: string]: Constructor<IContext<unknown>>;
} {
	return contextMethods;
}

function registerContextMethod(id: string, method: Constructor<IContext<unknown>>): void {
	if (contextMethods[id]) {
		throw new Error(`Method with id ${id} already registered.`);
	}
	contextMethods[id] = method;
}

registerContextMethod('get', Get);
registerContextMethod('set', Set);

export { IContext, getContextMethods, registerContextMethod };
