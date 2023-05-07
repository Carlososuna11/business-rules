import IFuntion from './IFunction';

export default class Upper implements IFuntion<string> {
  constructor(private readonly value: string) {}

  execute(): string {
    return this.value.toUpperCase();
  }
}
