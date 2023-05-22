import IEngine from './IEngine';
import { IRule, Rule } from '../rule';
import { RuleObject, EngineResult, Data } from '../types';

export default class Engine implements IEngine {
	public context: Data;
	public rules: IRule[];

	constructor(rules: RuleObject[]) {
		this.context = {};
		this.rules = [];
		this.addRules(rules);
	}

	addRules(rules: RuleObject[]): void {
		this.rules = rules.map((rule) => new Rule(rule, this.context));
	}

	evaluate(obj: object): EngineResult {
		// mantain context reference
		Object.assign(this.context, obj as Data);
		const start = Date.now();
		const results = this.rules.map((rule) => rule.execute());
		const elapsed = Date.now() - start;
		const fired = results.filter((result) => result.fired).length;

		const result: EngineResult = {
			elapsed,
			fired,
			results,
			context: { ...this.context },
		};

		// set context to empty object without mutating the original context
		Object.keys(this.context).forEach((key) => delete this.context[key]);

		return result;
	}
}
