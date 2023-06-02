import Addition from './commands/operators/Addition';
import { ContextData } from './context';

export * from './commands';
export * from './constants';
export * from './utils';
export * from './types';
export * from './context';
export * from './engine';
export * from './parsers';
export * from './rule';
export * from './exceptions';

var test = new Addition('ara', 1);

var num = '';

const hola = async () => {
	console.log('\nEl test es: ', await test.execute(new ContextData()));
	console.log('El string es: ', test.toString());
	return;
};

hola();
