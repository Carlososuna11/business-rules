import IEngine from './IEngine';
import { Rule, ConflictResolution, Delegator, RuleObserver } from '../rule';
import {
	RuleObject,
	EngineResult,
	Data,
	ConflictResolutionStrategies,
	RuleResult,
	LoggerOptions,
	DelegatorOptions,
} from '../types';
import { ContextData } from '../context';
import Session from './Session';
import { Logger } from '../utils';

export default class Engine implements IEngine<ContextData, Rule> {
	public contextData: ContextData;
	public rules: Rule[];
	public rulesbyId: Map<string, Rule>;
	public logger: Logger;

	constructor(rules: RuleObject[], loggerOptions: LoggerOptions = {}) {
		this.contextData = new ContextData();
		this.rules = [];
		this.rulesbyId = new Map<string, Rule>();
		this.addRules(rules);
		this.logger = new Logger(loggerOptions);
	}

	public addRules(rules: RuleObject[]): void {
		rules.forEach((rule) => {
			const newRule = new Rule(rule, this.contextData);
			this.rules.push(newRule);
			this.rulesbyId.set(newRule.id, newRule);
		});
	}

	public evaluate(
		obj: object,
		strategies: ConflictResolutionStrategies[] = [],
		delegatorOptions: DelegatorOptions = {}
	): EngineResult {
		const start = Date.now();
		this.contextData.reset();
		const conflictResolution = new ConflictResolution<Rule>(strategies);
		const delegator = new Delegator();
		this.contextData.data = RuleObserver(obj as Data, (segment: unknown) => delegator.delegate(segment));
		const session = new Session<Rule>();

		const rules = session.resolveConflicts(this.rules, conflictResolution);

		rules.forEach((rule) => {
			this.firePreAction(rule, delegator, delegatorOptions.preAction);
		});

		// evaluate rules
		for (const rule of rules) {
			this.evaluateRule(rule, delegator, session, delegatorOptions.condition);
			if (session.finalRule) break;
		}

		const trueRules = session.getTrueRules(rules);

		// fire post actions
		trueRules.forEach((rule) => {
			this.firePostAction(rule, delegator, session, delegatorOptions.postAction);
		});

		const end = Date.now();
		const time = end - start;
		return {
			elapsed: time,
			fired: session.fired,
			context: this.contextData.getContextData(),
		};
	}

	private evaluateRule(
		rule: Rule,
		delegator: Delegator<(...args: unknown[]) => unknown>,
		session: Session<Rule>,
		delegatorFunction?: (...args: unknown[]) => unknown
	): void {
		//
		if (rule.activationGroup && session.activationGroupConditionResult.get(rule.activationGroup)) {
			session.ruleConditionResult.set(rule.id, undefined);
			this.logger.debug({
				message: `Discard rule \`${rule.name}\` because activation group \`${rule.activationGroup}\` is already activated`,
			});
			return;
		}
		try {
			if (delegatorFunction) {
				delegator.set(delegatorFunction);
			} else {
				delegator.set((segment: unknown) => {
					const segmentName = Delegator.getSegmentName(segment);
					// logger
					this.logger.debug({
						message: `Access context segment \`${segmentName}\` in rule evaluation`,
						rule: rule.name,
					});
				});
			}
			const ruleEvaluation = rule.evaluate();
			if (ruleEvaluation && rule.final) {
				session.finalRule = rule;
			}
			if (ruleEvaluation && rule.activationGroup) {
				session.activationGroupConditionResult.set(rule.activationGroup, true);
			}
			session.ruleConditionResult.set(rule.id, ruleEvaluation);
		} catch (error) {
			this.logger.error({
				message: `Error executing evaluation for rule`,
				rule: rule.name,
				error: error instanceof Error ? error : new Error(String(error)),
			});
			session.ruleConditionResult.set(rule.id, undefined);
		} finally {
			delegator.unset();
		}
	}

	private firePreAction(
		rule: Rule,
		delegator: Delegator<(...args: unknown[]) => unknown>,
		delegatorFunction?: (...args: unknown[]) => unknown
	): void {
		try {
			if (delegatorFunction) {
				delegator.set(delegatorFunction);
			} else {
				delegator.set((segment: unknown) => {
					const segmentName = Delegator.getSegmentName(segment);
					// logger
					this.logger.debug({
						message: `Access context segment \`${segmentName}\` in pre actions`,
						rule: rule.name,
					});
				});
			}
			rule.executePreActions();
		} catch (error) {
			this.logger.error({
				message: `Error executing pre actions for rule`,
				rule: rule.name,
				error: error instanceof Error ? error : new Error(String(error)),
			});
		} finally {
			delegator.unset();
		}
	}
	private firePostAction(
		rule: Rule,
		delegator: Delegator<(...args: unknown[]) => unknown>,
		session: Session<Rule>,
		delegatorFunction?: (...args: unknown[]) => unknown
	): void {
		try {
			if (delegatorFunction) {
				delegator.set(delegatorFunction);
			} else {
				delegator.set((segment: unknown) => {
					const segmentName = Delegator.getSegmentName(segment);
					// logger
					this.logger.debug({
						message: `Access context segment \`${segmentName}\` in post actions`,
						rule: rule.name,
					});
				});
			}
			session.ruleActionResult.set(rule.id, rule.executePostActions());
			session.fired.push(session.ruleActionResult.get(rule.id) as RuleResult);
			if (rule.activationGroup) {
				this.logger.debug({
					message: `Activation group \`${rule.activationGroup}\` fired`,
				});
			}
			if (rule.final) {
				this.logger.debug({
					message: `Final rule \`${rule.name}\` fired`,
				});
			}
		} catch (error) {
			this.logger.error({
				message: `Error executing post actions for rule. Rule not fired`,
				rule: rule.name,
				error: error instanceof Error ? error : new Error(String(error)),
			});
		} finally {
			delegator.unset();
		}
	}
}
