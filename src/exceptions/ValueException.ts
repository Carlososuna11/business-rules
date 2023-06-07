import BusinessRulesException from './BusinessRulesException';

export default class ValueException extends BusinessRulesException {
	name = 'ValueException';

	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, ValueException.prototype);
	}
}
