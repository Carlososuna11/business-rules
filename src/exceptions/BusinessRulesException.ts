/**
 * Exception thrown when a business rule is violated.
 */
export default class BusinessRulesException extends Error {
	/**
	 * Name of the exception.
	 */
	name = 'BusinessRulesException';

	/**
	 * Creates a new instance of BusinessRulesException with the specified message.
	 * @param message The error message.
	 */
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, BusinessRulesException.prototype);
	}
}
