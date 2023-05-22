import { IRule } from '../rule';
import { RuleObject, EngineResult } from '../types';

export default interface IEngine {
	context: object;
	rules: IRule[];

	addRules(rules: RuleObject[]): void;
	evaluate(obj: object): EngineResult;
}
