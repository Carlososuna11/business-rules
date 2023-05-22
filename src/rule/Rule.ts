import IRule from './IRule';
import { ICommand } from '../commands';
import { RuleResult, RuleObject, Data } from '../types';
import { parseCondition, parseAction } from '../parsers';

export default class Rule implements IRule {
	public name: string;
	public description?: string;
	public conditionObject: object;
	public condition: ICommand<boolean>;
	public actionObjects?: object[];
	public actions?: ICommand<unknown>[];

	constructor(rule: RuleObject, context: Data) {
		this.name = rule.name;
		this.conditionObject = rule.condition;
		this.condition = parseCondition(context, rule.condition);
		this.actionObjects = rule.actions;
		this.actions = rule.actions?.map((action) => parseAction(context, action));
	}

	execute(): RuleResult {
		const fired = this.condition.execute();
		const actions = this.actions?.map((action) => action.execute());
		return {
			name: this.name,
			fired,
			actions,
		};
	}
}
