import { Constructor } from '../../types';
import Average from './Average';
import Ceil from './Ceil';
import Floor from './Floor';
import IFunction from './IFunction';
import Length from './Length';
import Lower from './Lower';
import Max from './Max';
import MaxDate from './MaxDate';
import Min from './Min';
import MinDate from './MinDate';
import Round from './Round';
import StandardDesviation from './StandardDesviation';
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

registerFunction('average', Average);
registerFunction('ceil', Ceil);
registerFunction('floor', Floor);
registerFunction('length', Length);
registerFunction('lower', Lower);
registerFunction('max', Max);
registerFunction('maxDate', MaxDate);
registerFunction('min', Min);
registerFunction('minDate', MinDate);
registerFunction('round', Round);
registerFunction('standarDesviation', StandardDesviation);
registerFunction('upper', Upper);

export { IFunction, getFunctions, registerFunction };
