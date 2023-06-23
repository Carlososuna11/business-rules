/**
 * This module exports methods and types related to the creation and management of context methods.
 * @module contextMethods
 */

import { Constructor } from '../../types';
import IContext from './IContext';
import Get from './get';
import Set from './set';
import { BusinessRulesException } from '../../exceptions';

/**
 * An object containing all registered context methods, indexed by their id.
 * @type {Object.<string, Constructor<IContext<unknown>>>}
 */
const contextMethods: { [key: string]: Constructor<IContext<unknown>> } = {};

/**
 * Returns an object containing all registered context methods.
 * @returns {Object.<string, Constructor<IContext<unknown>>>} An object containing all registered context methods.
 */
function getContextMethods(): {
	[key: string]: Constructor<IContext<unknown>>;
} {
	return contextMethods;
}

/**
 * Registers a new context method.
 * @param {string} id - The id of the context method to register.
 * @param {Constructor<IContext>} method - The constructor function of the context method to register.
 * @throws {BusinessRulesException} Throws an exception if a context method with the same id has already been registered.
 */
function registerContextMethod(id: string, method: Constructor<IContext<unknown>>): void {
	if (contextMethods[id]) {
		throw new BusinessRulesException(`Method with id ${id} already registered.`);
	}
	contextMethods[id] = method;
}

// Register default context methods
registerContextMethod('get', Get);
registerContextMethod('set', Set);

export { IContext, getContextMethods, registerContextMethod };
