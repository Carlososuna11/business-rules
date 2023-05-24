import { AbstractContextData } from '../context';
import { AbstractRule } from '../rule';
import { Logger } from '../utils';
import { RuleObject, EngineResult } from '../types';

export default interface IEngine<T extends AbstractContextData, R extends AbstractRule> {
	contextData: T;
	rules: R[];
	logger: Logger;

	addRules(rules: RuleObject[]): void;
	evaluate(obj: object): EngineResult;
}
