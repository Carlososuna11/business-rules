import { getOperators } from '../operators';
import { getFunctions } from '../functions';
import { ExpressionOptions } from '../types';

/*

operation structure:

types:
- op: operator
- fn: function
- val: value

{
    "[type].[code]":[
        arg1,
        arg2,
    ]
}

examples:
{
  "op.and": [
    {
      "op.equals": [1, 1]
    },
    {
      "op.equals": [
        {
          "func.upper": ["john"]
        },
        "JOHN"
      ]
    },
    {
      "op.equals": [
        {
          "name": "carlos",
          "age": 1
        },
        {
          "name": "carlos",
          "age": 1
        }
      ]
    }
  ]
}

*/

export const getOperation = (operation: object) => {
	const options: ExpressionOptions = {
		op: getOperators(),
		fn: getFunctions(),
	};

	if (typeof operation !== 'object') {
		return operation;
	}

	// if not have keys, return operation
	if (!Object.keys(operation).length) {
		return operation;
	}

	// ej: op.and => [op, and] ej: upper => [upper]
	const [type, code] = Object.keys(operation)[0].split('.');

	options[type][code];
};
