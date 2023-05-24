import IEngine from './IEngine';
import { Rule, ConflictResolution, Delegator, RuleObserver } from '../rule';
import { RuleObject, EngineResult, Data, ConflictResolutionStrategies, RuleResult, LoggerOptions } from '../types';
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

	public evaluate(obj: object, strategies: ConflictResolutionStrategies[] = []): EngineResult {
		const start = Date.now();
		this.contextData.reset();
		const conflictResolution = new ConflictResolution<Rule>(strategies);
		const delegator = new Delegator();
		this.contextData.data = RuleObserver(obj as Data, (segment: unknown) => delegator.delegate(segment));
		const session = new Session<Rule>();

		// fire pre actions

		this.rules.forEach((rule) => {
			this.firePreAction(rule, delegator);
		});

		// evaluate rules
		this.rules.forEach((rule) => {
			this.evaluateRule(rule, delegator, session);
		});

		const trueRules = session.getTrueRules(this.rules);
		const sortedRules = session.resolveConflicts(trueRules, conflictResolution);

		// fire post actions
		sortedRules.forEach((rule) => {
			this.firePostAction(rule, delegator, session);
		});

		const end = Date.now();
		const time = end - start;
		return {
			elapsed: time,
			fired: session.fired,
			discarted: session.discarted,
			context: this.contextData.getContextData(),
		};
	}

	private evaluateRule(
		rule: Rule,
		delegator: Delegator<(...args: unknown[]) => unknown>,
		session: Session<Rule>
	): void {
		try {
			delegator.set((segment: unknown) => {
				const segmentName = Delegator.getSegmentName(segment);
				// logger
				this.logger.debug({
					message: `Access context segment \`${segmentName}\` in rule evaluation`,
					rule: rule.name,
				});
			});
			session.ruleConditionResult.set(rule.id, rule.evaluate());
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

	private firePreAction(rule: Rule, delegator: Delegator<(...args: unknown[]) => unknown>): void {
		try {
			delegator.set((segment: unknown) => {
				const segmentName = Delegator.getSegmentName(segment);
				// logger
				this.logger.debug({
					message: `Access context segment \`${segmentName}\` in pre actions`,
					rule: rule.name,
				});
			});
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
		session: Session<Rule>
	): void {
		try {
			delegator.set((segment: unknown) => {
				const segmentName = Delegator.getSegmentName(segment);
				// logger
				this.logger.debug({
					message: `Access context segment \`${segmentName}\` in post actions`,
					rule: rule.name,
				});
			});
			session.ruleActionResult.set(rule.id, rule.executePostActions());
			session.fired.push(session.ruleActionResult.get(rule.id) as RuleResult);
		} catch (error) {
			this.logger.error({
				message: `Error executing pre actions for rule`,
				rule: rule.name,
				error: error instanceof Error ? error : new Error(String(error)),
			});
			session.ruleActionResult.set(rule.id, {
				name: rule.name,
				fired: false,
				discarted: true,
			});
			session.discarted.push(session.ruleActionResult.get(rule.id) as RuleResult);
		} finally {
			delegator.unset();
		}
	}
}
