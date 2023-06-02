import IException from '../IException';

export default class ValueException extends Error {
	// constructor(public id: string, public message: string) {}
	constructor(id?: string, message?: string) {
    super(message);
    this.name = `ValueException in ${id}`;
    Object.setPrototypeOf(this, ValueException.prototype);
  }
}
