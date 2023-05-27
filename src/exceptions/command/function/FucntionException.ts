import IException from '../../IException';

export default class FunctionException implements IException {
	constructor(public id: string, public message: string) {}
}
