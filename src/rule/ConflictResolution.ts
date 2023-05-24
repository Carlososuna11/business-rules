import { ConflictResolutionStrategies } from '../types';
import AbstractRule from './AbstractRule';
import { specificityLevel } from '../utils';

export default class ConflictResolution<R extends AbstractRule> {
	private strategies: ConflictResolutionStrategies[];

	constructor(strategies: ConflictResolutionStrategies[]) {
		this.strategies = strategies;
	}

	public resolve(rules: R[]): R[] {
		if (rules.length < 2) {
			return rules;
		}

		return this.strategies.reduce((rules, strategy) => this.resolveByStrategy(rules, strategy), rules);
	}

	private resolveByStrategy(rules: R[], strategy: ConflictResolutionStrategies): R[] {
		switch (strategy) {
			case 'specificity':
				return this.resolveBySpecificity(rules);
			case 'priority':
				return this.resolveByPriority(rules);
			case 'order':
				return this.resolveByOrder(rules);
			default:
				return rules;
		}
	}

	private resolveByPriority(rules: R[]): R[] {
		return rules.sort((a, b) => b.priority - a.priority);
	}

	private resolveBySpecificity(rules: R[]): R[] {
		return rules.sort((a, b) => specificityLevel(b.conditionObject) - specificityLevel(a.conditionObject));
	}

	private resolveByOrder(rules: R[]): R[] {
		return rules;
	}
}
