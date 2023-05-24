import { Data } from '../types';

export default abstract class AbstactContextData {
	public data: Data;

	constructor(data: Data = {}) {
		this.data = data;
	}

	abstract getContextData(): Data;
	abstract reset(): void;
}
