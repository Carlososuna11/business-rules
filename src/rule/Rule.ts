import AbstractRule from './AbstractRule';
import { RuleResult } from '../types';
import { ICommand } from '../commands';
export default class Rule extends AbstractRule {
	evaluate(): boolean {
		const result = this.condition.execute();
		return result;
	}

	executePreActions(): void {
		this.preActions.forEach((action: ICommand<unknown>) => action.execute());
	}

	executePostActions(): RuleResult {
		const actions = this.postActions.map((action: ICommand<unknown>) => action.execute());
		return {
			name: this.name,
			fired: true,
			discarted: false,
			actions,
		};
	}
}
