/* eslint-disable @typescript-eslint/no-explicit-any */
import IOperator from './IOperator';

export default class Contains implements IOperator<boolean> {
	collection: any[];
	value: any;
	constructor(collection: any[], value: any) {
		this.collection = collection;
		this.value = value;
	}
	execute(): boolean {
		return this.collection.includes(this.value);
	}
}
