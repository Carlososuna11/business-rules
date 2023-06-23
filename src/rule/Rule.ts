/**
 * Represents a rule that can be evaluated and execute pre-actions and post-actions based on the evaluation result.
 */
import AbstractRule from './AbstractRule';
import { RuleResult } from '../types';
import { ICommand } from '../commands';
import { AbstractContextData } from '../context';

export default class Rule extends AbstractRule {
	/**
	 * Evaluates the rule's condition based on the given context and returns a boolean value indicating if the condition is met or not.
	 * @param context The context data to be used during the evaluation.
	 * @returns A Promise that resolves to a boolean value indicating if the condition is met or not.
	 */
	async evaluate(context: AbstractContextData): Promise<boolean> {
		return await this.condition.execute(context);
	}

	/**
	 * Executes the pre-actions of the rule based on the given context.
	 * @param context The context data to be used during the execution of the pre-actions.
	 * @returns A Promise that resolves when all pre-actions have been executed.
	 */
	async executePreActions(context: AbstractContextData): Promise<void> {
		await Promise.all(this.preActions.map(async (action: ICommand<unknown>) => await action.execute(context)));
	}

	/**
	 * Executes the post-actions of the rule based on the given context and returns a RuleResult object.
	 * @param context The context data to be used during the execution of the post-actions.
	 * @returns A Promise that resolves to a RuleResult object containing the name of the rule, a boolean value indicating if the rule was fired or not, a boolean value indicating if the rule was discarded or not, and an array of the executed post-actions.
	 */
	async executePostActions(context: AbstractContextData): Promise<RuleResult> {
		const actions = await Promise.all(
			this.postActions.map(async (action: ICommand<unknown>) => await action.execute(context))
		);
		return {
			name: this.name,
			fired: true,
			discarted: false,
			actions,
		};
	}
}
