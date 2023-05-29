import { ICommand } from '../commands';
import { parseCondition, parseAction } from '../parsers';
import { v4 as uuidv4 } from 'uuid';
import { RuleResult, Data, RuleObject } from '../types';
import AbstactContextData from '../context/AbstractContextData';

export default abstract class AbstractRule {
	id: string;
	name: string;
	description?: string;
	conditionObject: Data;
	final: boolean;
	priority: number;
	condition: ICommand<boolean>;
	preActions: ICommand<unknown>[];
	postActions: ICommand<unknown>[];
	activationGroup?: string;
	preActionObjects?: Data[];
	postActionObjects?: Data[];
	ruleObject: RuleObject;

	constructor(rule: RuleObject) {
		// copy ruleObject to avoid mutating the original object
		this.ruleObject = JSON.parse(JSON.stringify(rule));
		this.id = uuidv4();
		this.name = rule.name;
		this.description = rule.description;
		this.conditionObject = rule.condition;
		this.condition = parseCondition(rule.condition);
		this.preActionObjects = rule.preActions;
		this.preActions = rule.preActions?.map((action) => parseAction(action)) || [];
		this.postActionObjects = rule.postActions;
		this.postActions = rule.postActions?.map((action) => parseAction(action)) || [];
		this.final = rule.final || false;
		this.priority = rule.priority || 0;
		this.activationGroup = rule.activationGroup;
	}

	abstract evaluate(context: AbstactContextData): Promise<boolean>;
	abstract executePreActions(context: AbstactContextData): Promise<void>;
	abstract executePostActions(context: AbstactContextData): Promise<RuleResult>;

	toString(): string {
		const condition = this.condition.toString();
		const preActions = this.preActions.map((action) => action.toString()).join('\n\t-');
		const postActions = this.postActions.map((action) => action.toString()).join('\n\t-');
		return `Rule: ${this.name}${
			preActions.length > 1 ? '\nbefore\n\t' + preActions : ''
		}\nwhen\n\t${condition}\nthen\n\t${postActions.length > 1 ? postActions : 'do nothing'}`;
	}

	getDiagramPart(): string {
		const condition = this.condition.toString();
		const preActions = this.preActions.map((action) => action.toString()).join('\n----\n');
		const postActions = this.postActions.map((action) => action.toString()).join('\n----\n');

		return `**:==${this.name}\n----\n${this.description ? this.description : ''};\n***:===PreActions\n====\n${
			preActions.length > 1 ? preActions : ''
		};\n****:===Condition\n====\n${condition};\n*****:===PostActions\n====\n${
			postActions.length > 1 ? postActions : ''
		};`;
	}
}
