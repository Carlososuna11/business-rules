import { Data } from '../types';
import AbstactContextData from './AbstractContextData';

export default class ContextData extends AbstactContextData {
	public extra: Data;

	constructor(data: Data = {}, extra: Data = {}) {
		super(data);
		this.extra = extra;
	}

	getContextData(): Data {
		return {
			data: this.data,
			extra: this.extra,
		};
	}

	reset(): void {
		this.data = {};
		this.extra = {};
	}
}
