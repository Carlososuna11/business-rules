export default interface ICommand<T> {
	id: string;
	execute(): T;
	toString(): string;
}

export function isCommand<T>(value: unknown): value is ICommand<T> {
	if (value === null || value === undefined) return false;
	return (
		typeof value === 'object' &&
		'execute' in value &&
		typeof (value as ICommand<T>).execute === 'function' &&
		'id' in value &&
		typeof (value as ICommand<T>).id === 'string' &&
		'toString' in value &&
		typeof (value as ICommand<T>).toString === 'function'
	);
}
