import { Constructor } from '../../types';
import Average from './Average';
import IFunction from './IFunction';
import Length from './Length';
import Lower from './Lower';
import Max from './Max';
import MaxDate from './MaxDate';
import Min from './Min';
import MinDate from './MinDate';
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
registerFunction('lower', Lower);
registerFunction('max', Max);
registerFunction('min', Min);
registerFunction('maxDate', MaxDate);
registerFunction('minDate', MinDate);
registerFunction('average', Average);
registerFunction('length', Length);

export { IFunction, getFunctions, registerFunction };
