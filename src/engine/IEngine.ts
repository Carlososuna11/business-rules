import { AbstractRule } from '../rule';
import { Logger } from '../utils';
import { RuleObject, EngineResult } from '../types';

export default interface IEngine {
	name: string;
	description: string;
	rules: AbstractRule[];
	logger: Logger;

	addRules(rules: RuleObject[]): Promise<void>;
	evaluate(obj: object): Promise<EngineResult>;
	toDiagram(): string;
	export(path: string, name: string): Promise<void>;
}
