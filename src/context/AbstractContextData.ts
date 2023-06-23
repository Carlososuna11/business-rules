import { Data } from '../types';

/**
 * Abstract class that represents context data.
 */
export default abstract class AbstactContextData {
	/**
	 * Data object that contains the context data.
	 */
	public data: Data;

	/**
	 * Creates an instance of AbstactContextData.
	 * @param {Data} data - Optional data to initialize the context.
	 */
	constructor(data: Data = {}) {
		this.data = data;
	}

	/**
	 * Abstract method to get the context data.
	 * @returns {Data} - A data object with the context data.
	 */
	abstract getContextData(): Data;

	/**
	 * Abstract method to reset the context data.
	 */
	abstract reset(): void;
}
