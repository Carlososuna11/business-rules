import ICommand from '../ICommand';
/**
 * An interface representing an operator that extends the ICommand interface.
 * @template T The type of input expected by the operator.
 */
export default interface IOperator<T> extends ICommand<T> {
	/**
	 * The symbol used to represent the operator.
	 */
	symbol: string;
}
