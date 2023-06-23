import { Data } from '../types';

/**
 * RuleObserver is a function that creates a Proxy object to observe and track access
 * to properties of a given data object.
 * @param object - The data object to be observed.
 * @param onAccess - A callback function to be invoked every time a property of the object is accessed.
 * @returns A Proxy object of the data object that tracks access to its properties.
 */
export default function RuleObserver(object: Data, onAccess: CallableFunction): Data {
	const handler: ProxyHandler<Data> = {
		/**
		 * A trap for getting the value of a property.
		 * @param target - The target object to get the property value from.
		 * @param property - The property name to get the value of.
		 * @param receiver - The value of 'this' when the proxy is called.
		 * @returns The retrieved property value of the target object.
		 */
		get(target, property, receiver) {
			onAccess(property);
			return Reflect.get(target, property, receiver);
		},
		/**
		 * A trap for defining a new property on the target object.
		 * @param target - The target object to define the property on.
		 * @param property - The property name to define.
		 * @param descriptor - The property descriptor to define.
		 * @returns True if the property was successfully defined, false otherwise.
		 */
		defineProperty(target, property, descriptor) {
			onAccess(property);
			return Reflect.defineProperty(target, property, descriptor);
		},
		/**
		 * A trap for deleting a property from the target object.
		 * @param target - The target object to delete the property from.
		 * @param property - The property name to delete.
		 * @returns True if the property was successfully deleted, false otherwise.
		 */
		deleteProperty(target, property) {
			onAccess(property);
			return Reflect.deleteProperty(target, property);
		},
	};
	return new Proxy(object, handler);
}
