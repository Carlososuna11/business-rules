import AbstractRule from './AbstractRule';
import { RuleResult } from '../types';
import { ICommand } from '../commands';
import { AbstractContextData } from '../context';
export default class Rule extends AbstractRule {
	async evaluate(context: AbstractContextData): Promise<boolean> {
		return await this.condition.execute(context);
	}

	async executePreActions(context: AbstractContextData): Promise<void> {
		await Promise.all(this.preActions.map(async (action: ICommand<unknown>) => await action.execute(context)));
	}

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
