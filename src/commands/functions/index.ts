import { Constructor } from '../../types';
import Average from './Average';
import BoolToNumber from './BoolToNumber';
import Ceil from './Ceil';
import Floor from './Floor';
import IFunction from './IFunction';
import IsNaN from './IsNaN';
import Length from './Length';
import Lower from './Lower';
import Max from './Max';
import MaxDate from './MaxDate';
import Min from './Min';
import MinDate from './MinDate';
import ParseFloat from './ParseFloat';
import ParseInt from './ParseInt';
import Regex from './Regex';
import Round from './Round';
import StandardDesviation from './StandardDesviation';
import ToBoolean from './ToBoolean';
import ToDate from './ToDate';
import ToString from './ToString';
import Trunc from './Trunc';
import Upper from './Upper';
import YearsFromNow from './YearsFromNow';
import Now from './Now';
import MaxObject from './MaxObject';
import MinObject from './MinObject';
import GetElement from './GetElement';
import GetProperty from './GetProperty';

import { BusinessRulesException } from '../../exceptions';

/**
 * HashMap containing all the registered functions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const functions: { [key: string]: Constructor<IFunction<unknown>> } = {};

/**
 * Returns a hashMap containing all the registered functions.
 * @returns A hashMap containing all the registered functions.
 */
function getFunctions(): {
	[key: string]: Constructor<IFunction<unknown>>;
} {
	return functions;
}

/**
 * Registers a new function with the given id and constructor.
 * @param id - The id of the function to register.
 * @param _function - The constructor of the function to register.
 * @throws Throws an exception if a function with the given id is already registered.
 */
function registerFunction(id: string, _function: Constructor<IFunction<unknown>>): void {
	if (functions[id]) {
		throw new BusinessRulesException(`Function with id ${id} already registered.`);
	}
	functions[id] = _function;
}

registerFunction('average', Average);
registerFunction('boolToNumber', BoolToNumber);
registerFunction('ceil', Ceil);
registerFunction('floor', Floor);
registerFunction('isNaN', IsNaN);
registerFunction('length', Length);
registerFunction('lower', Lower);
registerFunction('max', Max);
registerFunction('maxDate', MaxDate);
registerFunction('min', Min);
registerFunction('minDate', MinDate);
registerFunction('parseFloat', ParseFloat);
registerFunction('parseInt', ParseInt);
registerFunction('regex', Regex);
registerFunction('round', Round);
registerFunction('standardDesviation', StandardDesviation);
registerFunction('toBoolean', ToBoolean);
registerFunction('toDate', ToDate);
registerFunction('ToString', ToString);
registerFunction('trunc', Trunc);
registerFunction('upper', Upper);
registerFunction('yearsFromNow', YearsFromNow);
registerFunction('now', Now);
registerFunction('maxObject', MaxObject);
registerFunction('minObject', MinObject);
registerFunction('getElement', GetElement);
registerFunction('getProperty', GetProperty);

export { IFunction, getFunctions, registerFunction };
