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
	EngineObject,
} from '../types';
import { ContextData } from '../context';
import Session from './Session';
import { Logger } from '../utils';
import CONSTS from '../constants';
import { BSON, ObjectId } from 'bson';
import type { JSONSchema7 } from 'json-schema';
import { BusinessRulesException } from '../exceptions';

/**
 * Represents a business rules engine that can evaluate rules based on input data.
 */
export default class Engine implements IEngine {
	/**
	 * The name of the engine.
	 */
	public name: string;
	/**
	 * The JSON Schema defining the expected data input format.
	 */
	public dataSchema: JSONSchema7;
	/**
	 * A description of the engine.
	 */
	public description: string;
	/**
	 * The list of rules to be evaluated by the engine.
	 */
	public rules: Rule[];
	/**
	 * A map containing the rules mapped by their ID.
	 */
	public rulesbyId: Map<string, Rule>;
	/**
	 * The logger used by the engine.
	 */
	public logger: Logger;

	/**
	 * Creates a new instance of the engine.
	 * @param name - The name of the engine.
	 * @param rules - The list of rules to be evaluated by the engine.
	 * @param description - A description of the engine.
	 * @param loggerOptions - Options for the logger used by the engine.
	 * @param dataSchema - The JSON Schema defining the expected data input format.
	 */
	constructor(
		name: string,
		rules: RuleObject[],
		description = '',
		loggerOptions: LoggerOptions = {},
		dataSchema?: JSONSchema7
	) {
		this.name = name;
		this.description = description;
		this.rules = [];
		this.rulesbyId = new Map<string, Rule>();
		this.dataSchema = dataSchema || {};
		this.addRules(rules);
		this.logger = new Logger(loggerOptions);
	}

	/**
	 * Returns an object representation of the engine.
	 * @returns An object representation of the engine.
	 */
	public toObject(): EngineObject {
		return {
			name: this.name,
			description: this.description,
			rules: this.rules.map((rule) => rule.ruleObject),
		};
	}

	/**
	 * Adds a list of rules to the engine.
	 * @param rules - The list of rules to be added.
	 */
	public addRules(rules: RuleObject[]): void {
		rules.forEach((rule) => {
			const newRule = new Rule(rule);
			this.rules.push(newRule);
			this.rulesbyId.set(newRule.id, newRule);
		});
	}

	/**
	 * Returns a string representation of the engine in a diagram format.
	 * @returns A string representation of the engine in a diagram format.
	 */
	public toDiagram(): string {
		return `@startmindmap\n<style>\nnode {\nPadding 12\nHorizontalAlignment center\nRoundCorner 40\nMaximumWidth 200\n}\n:depth(2) {\nMaximumWidth 500\n}\n:depth(3) {\nMaximumWidth 500\n}\n:depth(4) {\nMaximumWidth 500\n}\n<style>\n* ==Engine\nright side\n${this.rules
			.map((rule) => rule.getDiagramPart())
			.join('\n')}\n@endmindmap`;
	}

	/**
	 * Evaluates the rules against the input data.
	 * @param obj - The input data to be evaluated.
	 * @param strategies - The conflict resolution strategies to be used.
	 * @param delegatorOptions - Options for the delegator used by the engine.
	 * @returns The results of the engine evaluation.
	 */
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

	/**
	 * Evaluates a single rule using the input context.
	 * @param context - The context data containing the input data for the rule evaluation.
	 * @param rule - The rule to be evaluated.
	 * @param delegator - The delegator used by the engine.
	 * @param session - The session used by the engine.
	 * @param delegatorFunction - The function used to evaluate the delegator.
	 */
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
				error: error instanceof Error ? error : new BusinessRulesException(String(error)),
			});
			session.ruleConditionResult.set(rule.id, undefined);
		} finally {
			delegator.unset();
		}
	}

	/**
	 * Fires the pre-actions of a rule.
	 * @param context - The context data containing the input data for the pre-actions.
	 * @param rule - The rule whose pre-actions should be fired.
	 * @param delegator - The delegator used by the engine.
	 * @param delegatorFunction - The function used to evaluate the delegator.
	 */
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
				error: error instanceof Error ? error : new BusinessRulesException(String(error)),
			});
		} finally {
			delegator.unset();
		}
	}

	/**
	 * Fires the post-actions of a rule.
	 * @param context - The context data containing the input data for the post-actions.
	 * @param rule - The rule whose post-actions should be fired.
	 * @param delegator - The delegator used by the engine.
	 * @param session - The session used by the engine.
	 * @param delegatorFunction - The function used to evaluate the delegator.
	 */
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
				error: error instanceof Error ? error : new BusinessRulesException(String(error)),
			});
		} finally {
			delegator.unset();
		}
	}

	/**
	 * Exports the engine to a TSBR file.
	 * @param path - The path where the file should be saved.
	 * @param name - The name of the file.
	 */
	public async export(path: string, name: string): Promise<void> {
		// exports the engine to a TSBR file

		const rules = this.rules.map((rule) => rule.ruleObject);

		const data = {
			_id: new ObjectId(),
			version: CONSTS.VERSION,
			name: this.name,
			description: this.description,
			rules,
			dataSchema: this.dataSchema,
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
			throw new BusinessRulesException(`Error exporting the engine: ${error}`);
		}
	}

	/**
	 * Imports an engine from a TSBR file.
	 * @param filePath - The path of the file to be imported.
	 * @param loggerOptions - Options for the logger used by the engine.
	 * @returns The imported engine.
	 */
	public static async import(filePath: string, loggerOptions: LoggerOptions = {}): Promise<Engine> {
		// imports the engine from a TSBR file
		try {
			const file = await fs.promises.open(filePath, 'r');
			const bytes = await file.readFile();
			const data = BSON.deserialize(bytes);
			//TODO: check version
			//TODO: check data structure
			const engine = new Engine(data.name, data.rules, data.description, loggerOptions, data.dataSchema);
			return engine;
		} catch (error) {
			throw new BusinessRulesException(`Error importing the engine: ${error}`);
		}
	}
}
