import { Engine } from './engine';
import { Rule } from './rule';
import { saveDiagram } from './utils';
import { registerFunction, registerOperator } from './commands';
import { RuleObject, Data, EngineResult } from './types';

interface User {
	name: string;
	age: number;
	email: string;
	address: string;
	phoneNumber?: string;
	rates: boolean[];
}
// generados con ChatGPT xd
const users: User[] = [
	{
		name: 'Ana García',
		age: 28,
		email: 'ana.garcia@mail.com',
		address: 'Calle Mayor, 4',
		phoneNumber: '+34 123 456 789',
		rates: [true, true, true],
	},
	{
		name: 'Juan Pérez',
		age: 35,
		email: 'juan.perez@mail.com',
		address: 'Calle Gran Vía, 20',
		phoneNumber: undefined,
		rates: [true, false, true],
	},
	{
		name: 'María Rodríguez',
		age: 42,
		email: 'maria.rodriguez@mail.com',
		address: 'Calle Alcalá, 15',
		phoneNumber: undefined,
		rates: [true, false, true],
	},
	{
		name: 'Pedro Sánchez',
		age: 55,
		email: 'pedro.sanchez@mail.com',
		address: 'Avenida de la Constitución, 8',
		phoneNumber: '+34 111 111 111',
		rates: [true, false, true],
	},
	{
		name: 'Lucía Fernández',
		age: 30,
		email: 'lucia.fernandez@mail.com',
		address: 'Calle San Bernardo, 12',
		phoneNumber: '+34 222 222 222',
		rates: [true, false, true],
	},
	{
		name: 'Javier Martínez',
		age: 43,
		email: 'javier.martinez@mail.com',
		address: 'Calle Bravo Murillo, 100',
		phoneNumber: '+34 333 333 333',
		rates: [true, false, false],
	},
	{
		name: 'Sara González',
		age: 25,
		email: 'sara.gonzalez@mail.com',
		address: 'Calle Fuencarral, 80',
		phoneNumber: '+34 444 444 444',
		rates: [true, false, true],
	},
	{
		name: 'David García',
		age: 20,
		email: 'david.garcia@mail.com',
		address: 'Calle Toledo, 30',
		phoneNumber: '+34 777 777 777',
		rates: [true, false, true],
	},
	{
		name: 'Luisa Pérez',
		age: 37,
		email: 'luisa.perez@mail.com',
		address: 'Calle Almagro, 6',
		phoneNumber: '+34 888 888 888',
		rates: [true, false, false],
	},
	{
		name: 'Carlos Gómez',
		age: 50,
		email: 'carlos.gomez@mail.com',
		address: 'Calle Serrano, 10',
		phoneNumber: '+34 999 999 999',
		rates: [true, false, false],
	},
];

const rules: RuleObject[] = [
	{
		name: 'Set Admin',
		description: 'Si el usuario es mayor de 30 años, asignarle el rol de "admin".',
		condition: {
			'$op.greaterThan': [
				{
					'$ctx.get': ['data.age'],
				},
				30,
			],
		},
		postActions: [
			{
				'$ctx.set': ['data.role', 'admin'],
			},
		],
	},
];

const engine = new Engine(rules, { filter: { error: true, debug: false, warn: true, info: true } });

const main = async () => {
	const responses = await Promise.all(
		users.map(async (user) => {
			return await engine.evaluate(user, ['priority']);
		})
	);

	for (const response of responses) {
		console.log(response);
	}
};

main();
