import { getOperators } from '../operators';
import { getFunctions } from '../functions';
import { getDataMethods } from '../data';
import { ExpressionOptions, Data } from '../types';
import IOperator from '../operators/IOperator';
import IFunction from '../functions/IFunction';
import IData from '../data/IData';

// Composite pattern
const parseAction = (
  dataObject: Data,
  actionStructure: object
): IFunction<unknown> => {
  const options: ExpressionOptions = {
    $op: getOperators(),
    $fn: getFunctions(),
    $data: getDataMethods(),
  };

  const parseExpression = (
    expression: object
  ): IOperator<unknown> | IFunction<unknown> | IData<unknown> | object => {
    const entries = Object.entries(expression);
    if (!entries.length) return expression;

    const [token, args] = entries[0];
    const [type, name] = token.split('.');

    if (!options[type]) return expression;
    if (!options[type][name]) {
      throw new Error(`Unknown ${type}: ${name}`);
    }
    // if args is not an array, raise an error
    if (!Array.isArray(args)) {
      throw new Error(`Arguments for ${token} must be an array`);
    }

    // if type is $data, inject dataObject into args (first argument)
    if (type === '$data') {
      args.unshift(dataObject);
    }

    const Class = options[type][name];
    const subExpressions = (args as object[]).map((arg: unknown) => {
      return typeof arg === 'object' && arg ? parseExpression(arg) : arg;
    });
    return new Class(...subExpressions);
  };

  return parseExpression(actionStructure) as
    | IFunction<unknown>
    | IData<unknown>;
};

export default parseAction;
