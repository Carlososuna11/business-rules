import { ICommand } from '../commands';
import { RuleResult } from '../types';

export default interface IRule {
	name: string;
	description?: string;
	conditionObject: object;
	condition: ICommand<boolean>;
	actionObjects?: object[];
	actions?: ICommand<unknown>[];

	execute(): RuleResult;
}
