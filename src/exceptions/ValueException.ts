/**
 * Exception thrown when a value does not meet the expected criteria.
 * Inherits from BusinessRulesException.
 */
import BusinessRulesException from './BusinessRulesException';

export default class ValueException extends BusinessRulesException {
	name = 'ValueException';

	/**
	 * Creates a new ValueException with the given message.
	 * @param message - The error message.
	 */
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, ValueException.prototype);
	}
}
