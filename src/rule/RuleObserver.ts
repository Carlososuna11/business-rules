import { Data } from '../types';

export default function RuleObserver(object: Data, onAccess: CallableFunction): Data {
	const handler: ProxyHandler<Data> = {
		get(target, property, receiver) {
			onAccess(property);
			return Reflect.get(target, property, receiver);
		},
		defineProperty(target, property, descriptor) {
			onAccess(property);
			return Reflect.defineProperty(target, property, descriptor);
		},
		deleteProperty(target, property) {
			onAccess(property);
			return Reflect.deleteProperty(target, property);
		},
	};
	return new Proxy(object, handler);
}