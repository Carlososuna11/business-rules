/**
 * Represents a Conflict Resolution class to resolve rule conflicts.
 */
import { ConflictResolutionStrategies } from '../types';
import AbstractRule from './AbstractRule';
import { specificityLevel } from '../utils';

export default class ConflictResolution<R extends AbstractRule> {
	/**
	 * Creates an instance of ConflictResolution.
	 * @param strategies the strategies to use for conflict resolution.
	 */
	constructor(private strategies: ConflictResolutionStrategies[]) {}

	/**
	 * Resolves conflicts between rules.
	 * @param rules the rules to resolve conflicts for.
	 * @returns an array of rules with resolved conflicts.
	 */
	public resolve(rules: R[]): R[] {
		if (rules.length < 2) {
			return rules;
		}

		return this.strategies.reduce((rules, strategy) => this.resolveByStrategy(rules, strategy), rules);
	}

	/**
	 * Resolves conflicts by a specific strategy.
	 * @param rules the rules to resolve conflicts for.
	 * @param strategy the strategy to use for resolving conflicts.
	 * @returns an array of rules with resolved conflicts.
	 */
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

	/**
	 * Resolves conflicts by priority.
	 * @param rules the rules to resolve conflicts for.
	 * @returns an array of rules with resolved conflicts.
	 */
	private resolveByPriority(rules: R[]): R[] {
		return rules.sort((a, b) => b.priority - a.priority);
	}

	/**
	 * Resolves conflicts by specificity.
	 * @param rules the rules to resolve conflicts for.
	 * @returns an array of rules with resolved conflicts.
	 */
	private resolveBySpecificity(rules: R[]): R[] {
		return rules.sort((a, b) => specificityLevel(b.conditionObject) - specificityLevel(a.conditionObject));
	}

	/**
	 * Resolves conflicts by order.
	 * @param rules the rules to resolve conflicts for.
	 * @returns an array of rules with resolved conflicts.
	 */
	private resolveByOrder(rules: R[]): R[] {
		return rules;
	}
}
