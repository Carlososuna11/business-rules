import { Data } from '../types';
import AbstactContextData from './AbstractContextData';

/**
 * Represents the ContextData class.
 * @class
 * @extends AbstactContextData
 */
export default class ContextData extends AbstactContextData {
	/**
	 * Represents the extra data of the ContextData instance.
	 * @public
	 */
	public extra: Data;

	/**
	 * Creates an instance of ContextData.
	 *
	 * @constructor
	 * @param {Data} data - The initial data to store in the ContextData instance.
	 * @param {Data} extra - The initial extra data to store in the ContextData instance.
	 */
	constructor(data: Data = {}, extra: Data = {}) {
		super(data);
		this.extra = extra;
	}

	/**
	 * Gets the context data object.
	 *
	 * @public
	 * @returns {Data} The context data object containing the data and extra data.
	 */
	getContextData(): Data {
		return {
			data: this.data,
			extra: this.extra,
		};
	}

	/**
	 * Resets the data and extra data of the ContextData instance.
	 *
	 * @public
	 * @returns {void}
	 */
	reset(): void {
		this.data = {};
		this.extra = {};
	}
}
