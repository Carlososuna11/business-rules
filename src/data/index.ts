import Get from '../commands/contexts/get';
import Set from '../commands/contexts/set';
import { Constructor } from '../types';
import IData from './IData';

// Operators hashMap
const dataMethods: { [key: string]: Constructor<IData<unknown>> } = {};

export function getDataMethods(): {
	[key: string]: Constructor<IData<unknown>>;
} {
	return dataMethods;
}

export function registerDataMethod<T extends Constructor<IData<unknown>>>(code: string) {
	return function (ctor: T): T {
		if (dataMethods[code]) {
			throw new Error(`Data Method with code ${code} already registered.`);
		}
		dataMethods[code] = ctor;
		return ctor;
	};
}

// Register operators
registerDataMethod('get')(Get);
registerDataMethod('set')(Set);
