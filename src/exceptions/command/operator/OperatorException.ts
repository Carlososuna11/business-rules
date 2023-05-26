import IException from '../../IException';

export default class OperatorException implements IException {
	constructor(public id: string, public message: string) {}
}
