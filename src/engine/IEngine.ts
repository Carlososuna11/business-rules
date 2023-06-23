import { AbstractRule } from '../rule';
import { Logger } from '../utils';
import { RuleObject, EngineResult, EngineObject } from '../types';

/**
 * Represents an engine for evaluating rules against objects.
 */
export default interface IEngine {
	/**
	 * The name of the engine.
	 */
	name: string;
	/**
	 * A description of the engine.
	 */
	description: string;
	/**
	 * An array of rules to evaluate.
	 */
	rules: AbstractRule[];
	/**
	 * An object for logging information.
	 */
	logger: Logger;

	/**
	 * Adds an array of RuleObjects to the engine.
	 * @param rules An array of RuleObjects to add.
	 */
	addRules(rules: RuleObject[]): void;

	/**
	 * Evaluates an object against the engine's rules.
	 * @param obj The object to evaluate.
	 * @returns A Promise containing the EngineResult of the evaluation.
	 */
	evaluate(obj: object): Promise<EngineResult>;

	/**
	 * Returns a string representing a diagram of the engine's rules.
	 * @returns A string representing a diagram of the engine's rules.
	 */
	toDiagram(): string;

	/**
	 * Returns an EngineObject representing the engine.
	 * @returns An EngineObject representing the engine.
	 */
	toObject(): EngineObject;

	/**
	 * Exports the engine to a file at the specified path with the specified name.
	 * @param path The path to export the engine to.
	 * @param name The name of the exported engine file.
	 * @returns A Promise that resolves when the export is complete.
	 */
	export(path: string, name: string): Promise<void>;
}
