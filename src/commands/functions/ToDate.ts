import { AbstractContextData } from "../../context";
import { TypeGuard } from "../../utils";
import ICommand from "../ICommand";
import IFunction from "./IFunction";
var moment = require('moment'); 


export default class ToDate implements IFunction<Date> {
  id = 'toDate';

  private readonly dateValue: ICommand<string> | string;
  private readonly datePattern: string;

  typeGuard: TypeGuard = new TypeGuard(['string']);

  constructor(dateValue: ICommand<string> | string, datePattern: string) {
    this.dateValue = dateValue;
    this.datePattern = datePattern;
  }

  private async validateValue(value: string, operandName: string): Promise<void> {
    await this.typeGuard.evaluate(value, this.id, operandName);
  }

  async execute(context: AbstractContextData): Promise<Date> {
    const dateValue = typeof this.dateValue === 'string' ? this.dateValue : await this.dateValue.execute(context);

    await this.validateValue(dateValue, 'dateValue');

    const date = new Date(dateValue);

    const parsedDate = moment(date).format(this.datePattern);

    // if (isNaN(parsedDate.getTime())) {
    //   throw new Error(`Invalid date: ${dateValue}`);
    // }

    return parsedDate;
  }

  toString(): string {
    return `${this.id}(${this.dateValue.toString()}, '${this.datePattern}')`;
  }
}
// export default class ToDate implements IFunction<Date> {
//   id = 'toDate';

//   private readonly dateValue: ICommand<string> | string;

//   typeGuard: TypeGuard = new TypeGuard(['string']);

//   constructor(dateValue: ICommand<string> | string) {
//     this.dateValue = dateValue;
//   }

//   private async validateValue(value: string, operandName: string): Promise<void> {
//     await this.typeGuard.evaluate(value, this.id, operandName);
//   }

//   async execute(context: AbstractContextData): Promise<Date> {
//     const dateValue = typeof this.dateValue === 'string' ? this.dateValue : await this.dateValue.execute(context);

//     await this.validateValue(dateValue, 'dateValue');

//     const date = new Date(dateValue);

//     if (isNaN(date.getTime())) {
//       throw new Error(`Invalid date: ${dateValue}`);
//     }
//     return date;
//   }

//   toString(): string {
//     return `${this.id}(${this.dateValue.toString()})`;
//   }
// }