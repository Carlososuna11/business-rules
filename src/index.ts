import Average from './commands/functions/Average';
import And from './commands/operators/And';
import { ContextData } from './context';
import { Engine } from './engine';
import { RuleObject } from './types';

interface User {
	name: string;
	age: number;
	email: string;
	gay: boolean;
	address: string;
	phoneNumber?: string;
	rates: boolean[];
}
// generados con ChatGPT xd
const users: User[] = [
	{
		name: 'Ana García',
		age: 28,
		gay: true,
		email: 'ana.garcia@mail.com',
		address: 'Calle Mayor, 4',
		phoneNumber: '+34 123 456 789',
		rates: [true, true, true],
	},
	{
		name: 'Juan Pérez',
		age: 35,
		gay: false,
		email: 'juan.perez@mail.com',
		address: 'Calle Gran Vía, 20',
		phoneNumber: undefined,
		rates: [true, false, true],
	},
	{
		name: 'María Rodríguez',
		age: 42,
		gay: false,
		email: 'maria.rodriguez@mail.com',
		address: 'Calle Alcalá, 15',
		phoneNumber: undefined,
		rates: [true, false, true],
	},
	{
		name: 'Pedro Sánchez',
		age: 55,
		gay: false,
		email: 'pedro.sanchez@mail.com',
		address: 'Avenida de la Constitución, 8',
		phoneNumber: '+34 111 111 111',
		rates: [true, false, true],
	},
	{
		name: 'Lucía Fernández',
		age: 30,
		gay: false,
		email: 'lucia.fernandez@mail.com',
		address: 'Calle San Bernardo, 12',
		phoneNumber: '+34 222 222 222',
		rates: [true, false, true],
	},
	{
		name: 'Javier Martínez',
		age: 43,
		gay: false,
		email: 'javier.martinez@mail.com',
		address: 'Calle Bravo Murillo, 100',
		phoneNumber: '+34 333 333 333',
		rates: [true, false, false],
	},
	{
		name: 'Sara González',
		age: 25,
		gay: false,
		email: 'sara.gonzalez@mail.com',
		address: 'Calle Fuencarral, 80',
		phoneNumber: '+34 444 444 444',
		rates: [true, false, true],
	},
	{
		name: 'David García',
		age: 20,
		gay: false,
		email: 'david.garcia@mail.com',
		address: 'Calle Toledo, 30',
		phoneNumber: '+34 777 777 777',
		rates: [true, false, true],
	},
	{
		name: 'Luisa Pérez',
		age: 37,
		gay: false,
		email: 'luisa.perez@mail.com',
		address: 'Calle Almagro, 6',
		phoneNumber: '+34 888 888 888',
		rates: [true, false, false],
	},
	{
		name: 'Carlos Gómez',
		age: 50,
		gay: false,
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
	{
		name: 'Rule 2',
		final: true,
		priority: 1,
		description:
			'Si el usuario tiene el numero de telefono vacio, rellenarlo con el numero de telefono de la empresa. y agregar un atributo de setPhoneNumber a true',
		condition: {
			'$op.equal': [
				{
					'$ctx.get': ['data.phoneNumber'],
				},
				undefined,
			],
		},
		postActions: [
			{
				'$ctx.set': ['data.phoneNumber', '+34 123 456 789'],
			},
			{
				'$ctx.set': ['data.setPhoneNumber', true],
			},
		],
	},
	{
		name: 'Rule 3',
		description:
			'Si la primera valoración es negativa (false), enviar un email al usuario con una encuesta de satisfacción.',
		condition: {
			'$op.equal': [
				{
					'$ctx.get': ['data.rates[0]'],
				},
				false,
			],
		},
		preActions: [
			{
				'$ctx.set': [
					'extra.emailUpper',
					{
						'$fn.upper': [
							{
								'$ctx.get': ['data.email'],
							},
						],
					},
				],
			},
		],
	},
	{
		name: 'Rule 4',
		description: 'Todas las valoraciones son positivas',
		condition: {
			'$op.and': [
				{
					'$ctx.get': ['data.rates'],
				},
			],
		},
		postActions: [
			{
				'$ctx.set': ['data.allRatesPositive', true],
			},
		],
	},
];

const main = async () => {
		// const engine = new Engine(rules, { filter: { error: true, debug: false, warn: true, info: true } });

		// const responses = await Promise.all(
		// 	users.map(async (user) => {
		// 		return await engine.evaluate(user, ['priority']);
		// 	})
		// );

	// for (const response of responses) {
	// 	console.log(response);
	// }

	var test = new And(false, true, 2);

	const hola = async () => {
		console.log('\nEl test es: ', await test.execute(new ContextData()));
		return;
	};

	hola();

	// console.log('El string es: ', test.toString());
	// console.log(engine.rules[1].toString());
};

main();
