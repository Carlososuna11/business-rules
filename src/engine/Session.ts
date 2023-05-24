import { AbstractRule, ConflictResolution } from '../rule';
import { RuleResult } from '../types';

export default class Session<R extends AbstractRule> {
	constructor(
		public fired: RuleResult[] = [],
		public ruleConditionResult: Map<string, boolean | undefined> = new Map<string, boolean>(),
		public activationGroupConditionResult: Map<string, boolean | undefined> = new Map<string, boolean>(),
		public ruleActionResult: Map<string, RuleResult> = new Map<string, RuleResult>(),
		public finalRule: R | undefined = undefined
	) {}

	getTrueRules(rules: R[]): R[] {
		return rules.filter((rule) => this.ruleConditionResult.get(rule.id) === true);
	}

	resolveConflicts(rules: R[], conflictResolution: ConflictResolution<R>): R[] {
		return conflictResolution.resolve(rules);
	}
}
