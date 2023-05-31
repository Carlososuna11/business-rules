import { AbstractRule } from '../rule';
import { Logger } from '../utils';
import { RuleObject, EngineResult, EngineObject } from '../types';

export default interface IEngine {
	name: string;
	description: string;
	rules: AbstractRule[];
	logger: Logger;

	addRules(rules: RuleObject[]): void;
	evaluate(obj: object): Promise<EngineResult>;
	toDiagram(): string;
	toObject(): EngineObject;
	export(path: string, name: string): Promise<void>;
}
