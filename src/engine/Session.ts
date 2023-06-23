import { AbstractRule, ConflictResolution } from '../rule';
import { RuleResult } from '../types';

/**
 * Class representing a session of rule execution.
 * @template R - A type parameter that extends the AbstractRule class.
 */
export default class Session<R extends AbstractRule> {
	/**
	 * Creates a new session instance.
	 * @param fired - An array of fired rules.
	 * @param ruleConditionResult - A map of rule condition results.
	 * @param activationGroupConditionResult - A map of activation group condition results.
	 * @param ruleActionResult - A map of rule action results.
	 * @param finalRule - The final rule that was executed.
	 */
	constructor(
		public fired: RuleResult[] = [],
		public ruleConditionResult: Map<string, boolean | undefined> = new Map<string, boolean>(),
		public activationGroupConditionResult: Map<string, boolean | undefined> = new Map<string, boolean>(),
		public ruleActionResult: Map<string, RuleResult> = new Map<string, RuleResult>(),
		public finalRule: R | undefined = undefined
	) {}

	/**
	 * Gets an array of rules that have their condition result set to true.
	 * @param rules - An array of rules to check condition results against.
	 * @returns An array of rules with true condition results.
	 */
	getTrueRules(rules: R[]): R[] {
		return rules.filter((rule) => this.ruleConditionResult.get(rule.id) === true);
	}

	/**
	 * Resolves conflicts between rules using the specified conflict resolution strategy.
	 * @param rules - An array of rules to resolve conflicts for.
	 * @param conflictResolution - An instance of the ConflictResolution class.
	 * @returns An array of resolved rules.
	 */
	resolveConflicts(rules: R[], conflictResolution: ConflictResolution<R>): R[] {
		return conflictResolution.resolve(rules);
	}
}
