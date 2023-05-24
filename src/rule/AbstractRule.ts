import { ICommand } from '../commands';
import { parseCondition, parseAction } from '../parsers';
import { ContextData } from '../context';
import { v4 as uuidv4 } from 'uuid';
import { RuleResult, Data, RuleObject } from '../types';

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

	constructor(rule: RuleObject, contextData: ContextData) {
		this.id = uuidv4();
		this.name = rule.name;
		this.description = rule.description;
		this.conditionObject = rule.condition;
		this.condition = parseCondition(contextData, rule.condition);
		this.preActionObjects = rule.preActions;
		this.preActions = rule.preActions?.map((action) => parseAction(contextData, action)) || [];
		this.postActionObjects = rule.postActions;
		this.postActions = rule.postActions?.map((action) => parseAction(contextData, action)) || [];
		this.final = rule.final || false;
		this.priority = rule.priority || 0;
		this.activationGroup = rule.activationGroup;
	}

	abstract evaluate(): boolean;
	abstract executePreActions(): void;
	abstract executePostActions(): RuleResult;
}
