export default interface ICommand<T> {
	id: string;
	execute(): T;
}

export function isCommand<T>(value: unknown): value is ICommand<T> {
	if (value === null || value === undefined) return false;
	return typeof value === 'object' && 'execute' in value && typeof (value as ICommand<T>).execute === 'function';
}
