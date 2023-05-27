import IException from '../IException';

export default class ValueException implements IException {
	constructor(public id: string, public message: string) {}
}
