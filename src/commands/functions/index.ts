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
import YearsFrom from './YearsFrom';
import { BusinessRulesException } from '../../exceptions';

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
registerFunction('standarDesviation', StandardDesviation);
registerFunction('toBoolean', ToBoolean);
registerFunction('toDate', ToDate);
registerFunction('ToString', ToString);
registerFunction('trunc', Trunc);
registerFunction('upper', Upper);
registerFunction('yearsFrom', YearsFrom);

export { IFunction, getFunctions, registerFunction };
