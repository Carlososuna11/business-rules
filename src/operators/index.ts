import { Constructor } from '../types';
import IOperator from './IOperator';
import And from './And';
import Or from './Or';

// Operators hashMap
const operators: { [key: string]: Constructor<IOperator<unknown>> } = {};

export function getOperators(): {
  [key: string]: Constructor<IOperator<unknown>>;
} {
  return operators;
}

export function registerOperator<T extends Constructor<IOperator<unknown>>>(
  code: string
) {
  return function (ctor: T): T {
    if (operators[code]) {
      throw new Error(`Operator with code ${code} already registered.`);
    }
    operators[code] = ctor;
    return ctor;
  };
}

// Register operators
registerOperator('and')(And);
registerOperator('or')(Or);
