import IEngine from './IEngine';
import fs from 'fs';
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
import CONSTS from '../constants';
import { BSON, ObjectId } from 'bson';

export default class Engine implements IEngine {
	public name: string;
	public description: string;
	public rules: Rule[];
	public rulesbyId: Map<string, Rule>;
	public logger: Logger;

	constructor(name: string, rules: RuleObject[], description = '', loggerOptions: LoggerOptions = {}) {
		this.name = name;
		this.description = description;
		this.rules = [];
		this.rulesbyId = new Map<string, Rule>();
		this.addRules(rules);
		this.logger = new Logger(loggerOptions);
	}

	public async addRules(rules: RuleObject[]): Promise<void> {
		rules.forEach((rule) => {
			const newRule = new Rule(rule);
			this.rules.push(newRule);
			this.rulesbyId.set(newRule.id, newRule);
		});
	}

	public toDiagram(): string {
		return `@startmindmap\n<style>\nnode {\nPadding 12\nHorizontalAlignment center\nRoundCorner 40\nMaximumWidth 200\n}\n:depth(2) {\nMaximumWidth 500\n}\n:depth(3) {\nMaximumWidth 500\n}\n:depth(4) {\nMaximumWidth 500\n}\n<style>\n* ==Engine\nright side\n${this.rules
			.map((rule) => rule.getDiagramPart())
			.join('\n')}\n@endmindmap`;
	}

	public async evaluate(
		obj: object,
		strategies: ConflictResolutionStrategies[] = [],
		delegatorOptions: DelegatorOptions = {}
	): Promise<EngineResult> {
		const start = Date.now();
		const contextData = new ContextData();
		const conflictResolution = new ConflictResolution<Rule>(strategies);
		const delegator = new Delegator();
		contextData.data = RuleObserver(obj as Data, (segment: unknown) => delegator.delegate(segment));
		const session = new Session<Rule>();

		const rules = session.resolveConflicts(this.rules, conflictResolution);

		// fire pre actions
		await Promise.all(
			rules.map(async (rule) => {
				await this.firePreAction(contextData, rule, delegator, delegatorOptions.preAction);
			})
		);
		// evaluate rules
		for (const rule of rules) {
			await this.evaluateRule(contextData, rule, delegator, session, delegatorOptions.condition);
			if (session.finalRule) break;
		}

		const trueRules = session.getTrueRules(rules);

		// fire post actions
		await Promise.all(
			trueRules.map(async (rule) => {
				await this.firePostAction(contextData, rule, delegator, session, delegatorOptions.postAction);
			})
		);

		const end = Date.now();
		const time = end - start;
		const context = contextData.getContextData();
		return {
			elapsed: time,
			fired: session.fired,
			context,
		};
	}

	private async evaluateRule(
		context: ContextData,
		rule: Rule,
		delegator: Delegator<(...args: unknown[]) => unknown>,
		session: Session<Rule>,
		delegatorFunction?: (...args: unknown[]) => unknown
	): Promise<void> {
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
				delegator.set(async (segment: unknown) => {
					const segmentName = Delegator.getSegmentName(segment);
					// logger
					await this.logger.debug({
						message: `Access context segment \`${segmentName}\` in rule evaluation`,
						rule: rule.name,
					});
				});
			}
			const ruleEvaluation = await rule.evaluate(context);
			if (ruleEvaluation && rule.final) {
				session.finalRule = rule;
			}
			if (ruleEvaluation && rule.activationGroup) {
				session.activationGroupConditionResult.set(rule.activationGroup, true);
			}
			session.ruleConditionResult.set(rule.id, await ruleEvaluation);
		} catch (error) {
			await this.logger.error({
				message: `Error executing evaluation for rule`,
				rule: rule.name,
				error: error instanceof Error ? error : new Error(String(error)),
			});
			session.ruleConditionResult.set(rule.id, undefined);
		} finally {
			delegator.unset();
		}
	}

	private async firePreAction(
		context: ContextData,
		rule: Rule,
		delegator: Delegator<(...args: unknown[]) => unknown>,
		delegatorFunction?: (...args: unknown[]) => unknown
	): Promise<void> {
		try {
			if (delegatorFunction) {
				delegator.set(delegatorFunction);
			} else {
				delegator.set(async (segment: unknown) => {
					const segmentName = Delegator.getSegmentName(segment);
					// logger
					await this.logger.debug({
						message: `Access context segment \`${segmentName}\` in pre actions`,
						rule: rule.name,
					});
				});
			}
			await rule.executePreActions(context);
		} catch (error) {
			await this.logger.error({
				message: `Error executing pre actions for rule`,
				rule: rule.name,
				error: error instanceof Error ? error : new Error(String(error)),
			});
		} finally {
			delegator.unset();
		}
	}
	private async firePostAction(
		context: ContextData,
		rule: Rule,
		delegator: Delegator<(...args: unknown[]) => unknown>,
		session: Session<Rule>,
		delegatorFunction?: (...args: unknown[]) => unknown
	): Promise<void> {
		try {
			if (delegatorFunction) {
				delegator.set(delegatorFunction);
			} else {
				delegator.set(async (segment: unknown) => {
					const segmentName = Delegator.getSegmentName(segment);
					// logger
					await this.logger.debug({
						message: `Access context segment \`${segmentName}\` in post actions`,
						rule: rule.name,
					});
				});
			}
			session.ruleActionResult.set(rule.id, await rule.executePostActions(context));
			session.fired.push(session.ruleActionResult.get(rule.id) as RuleResult);
			if (rule.activationGroup) {
				await this.logger.debug({
					message: `Activation group \`${rule.activationGroup}\` fired`,
				});
			}
			if (rule.final) {
				await this.logger.debug({
					message: `Final rule \`${rule.name}\` fired`,
				});
			}
		} catch (error) {
			await this.logger.error({
				message: `Error executing post actions for rule. Rule not fired`,
				rule: rule.name,
				error: error instanceof Error ? error : new Error(String(error)),
			});
		} finally {
			delegator.unset();
		}
	}

	public async export(path: string, name: string): Promise<void> {
		// exports the engine to a TSBR file

		const rules = this.rules.map((rule) => rule.ruleObject);

		const data = {
			_id: new ObjectId(),
			version: CONSTS.VERSION,
			name: this.name,
			description: this.description,
			rules,
			createdAt: new Date().toISOString(),
		};

		const bytes = BSON.serialize(data);
		// save to file
		try {
			const fileName = `${name}.tsbr`;
			const file = await fs.promises.open(`${path}/${fileName}`, 'w');
			await file.write(bytes);
			await file.close();
		} catch (error) {
			throw new Error(`Error exporting the engine: ${error}`);
		}
	}

	public static async import(filePath: string, loggerOptions: LoggerOptions = {}): Promise<Engine> {
		// imports the engine from a TSBR file
		try {
			const file = await fs.promises.open(filePath, 'r');
			const bytes = await file.readFile();
			const data = BSON.deserialize(bytes);
			//TODO: check version
			//TODO: check data structure
			const engine = new Engine(data.name, data.rules, data.description, loggerOptions);
			return engine;
		} catch (error) {
			throw new Error(`Error importing the engine: ${error}`);
		}
	}
}
