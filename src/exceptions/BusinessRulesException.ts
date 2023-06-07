export default class BusinessRulesException extends Error {
	name = 'BusinessRulesException';

	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, BusinessRulesException.prototype);
	}
}
