import { ICommand } from '../commands';
import { parseCondition, parseAction } from '../parsers';
import { v4 as uuidv4 } from 'uuid';
import { RuleResult, Data, RuleObject } from '../types';
import AbstactContextData from '../context/AbstractContextData';

export default abstract class AbstractRule {
	/**
	 * Abstract Rule class that represents a rule object
	 * @param rule - RuleObject that contains all the information for the rule
	 */
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

	/**
	 * Unique identifier for the rule
	 */
	id: string;

	/**
	 * Name of the rule
	 */
	name: string;

	/**
	 * Description of the rule, if any
	 */
	description?: string;

	/**
	 * Object that represents the condition for the rule
	 */
	conditionObject: Data;

	/**
	 * Flag that indicates if the rule should end the execution chain
	 */
	final: boolean;

	/**
	 * Priority of the rule, used to order the execution of the rules
	 */
	priority: number;

	/**
	 * Command that represents the condition for the rule
	 */
	condition: ICommand<boolean>;

	/**
	 * Array of Command objects that represent the pre-actions for the rule
	 */
	preActions: ICommand<unknown>[];

	/**
	 * Array of Data objects that represent the pre-actions for the rule
	 */
	preActionObjects?: Data[];

	/**
	 * Array of Command objects that represent the post-actions for the rule
	 */
	postActions: ICommand<unknown>[];

	/**
	 * Array of Data objects that represent the post-actions for the rule
	 */
	postActionObjects?: Data[];

	/**
	 * Name of the activation group for the rule, if any
	 */
	activationGroup?: string;

	/**
	 * RuleObject that contains all the information for the rule
	 */
	ruleObject: RuleObject;

	/**
	 * Evaluates the condition of the rule and returns a boolean indicating if the rule should be executed
	 * @param context - Object that represents the context of the execution
	 */
	abstract evaluate(context: AbstactContextData): Promise<boolean>;

	/**
	 * Executes the pre-actions for the rule
	 * @param context - Object that represents the context of the execution
	 */
	abstract executePreActions(context: AbstactContextData): Promise<void>;

	/**
	 * Executes the post-actions for the rule
	 * @param context - Object that represents the context of the execution
	 * @returns - Object that represents the result of the execution
	 */
	abstract executePostActions(context: AbstactContextData): Promise<RuleResult>;

	/**
	 * Returns a string representation of the rule
	 * @returns - String representation of the rule
	 */
	toString(): string {
		const condition = this.condition.toString();
		const preActions = this.preActions.map((action) => action.toString()).join('\n\t-');
		const postActions = this.postActions.map((action) => action.toString()).join('\n\t-');
		return `Rule: ${this.name}${
			preActions.length > 1 ? '\nbefore\n\t' + preActions : ''
		}\nwhen\n\t${condition}\nthen\n\t${postActions.length > 1 ? postActions : 'do nothing'}`;
	}

	/**
	 * Returns a string representation of the rule in a format compatible with diagrams
	 * @returns - String representation of the rule in a format compatible with diagrams
	 */
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
