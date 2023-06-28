# TypeScript Business Rules Engine

A Typescript rule engine where rules are defined in JSON format.

_Facts_ are plain JavaScript or JSON objects or objects from ES6 classes with getters and setters.
_Rules_ are specified in pure JavaScript rather than in a separate, special-purpose language like DSL.

## Install

```bash
npm install typescript-business-rules-engine
```

## Usage

This is a basic example.

```ts
// import
import { Engine } from 'typescript-business-rules-engine';

const facts = {
	user: {
		name: 'frank',
		stars: 347,
	},
	weather: {
		temperature: 20,
		windy: true,
		rainy: false,
	},
};

const rules = [
	{
		// if data.user.stars >= 200 then data.user.mood = 'great'
		name: 'Mood Great',
		description: 'mood is great if 200 stars or more',
		priority: 0,
		final: false,
		activationGroup: '',
		condition: {
			'$op.greaterEqualThan': [
				{
					'$ctx.get': ['data.user.stars'],
				},
				200,
			],
		},
		preActions: [],
		postActions: [
			{
				'$ctx.set': ['data.user.mood', 'great'],
			},
		],
	},
	{
		// if data.user.mood === 'great && data.weather.temperature >= 20 && !data.weather.rainy then data.goWalking = true
		name: 'go for wak',
		description: 'go for a walk if mood is great and the weather is fine',
		priority: 0,
		final: false,
		activationGroup: '',
		condition: {
			'$op.and': [
				{
					'$op.equal': [
						{
							'$ctx.get': ['data.user.mood'],
						},
						'great',
					],
				},
				{
					'$op.greaterEqualThan': [
						{
							'$ctx.get': ['data.weather.temperature'],
						},
						20,
					],
				},
				{
					'$op.not': [
						{
							'$ctx.get': ['data.weather.rainy'],
						},
					],
				},
			],
		},
		preActions: [],
		postActions: [
			{
				'$ctx.set': ['data.goWalking', true],
			},
		],
	},
	{
		// if wheater.temperature < 20 then data.user.mood = 'bad'
		name: 'Mood Bad',
		description: 'mood is bad if temperature is below 20',
		priority: 0,
		final: false,
		activationGroup: '',
		condition: {
			'$op.lessThan': [
				{
					'$ctx.get': ['data.weather.temperature'],
				},
				20,
			],
		},
		preActions: [],
		postActions: [
			{
				'$ctx.set': ['data.user.mood', 'bad'],
			},
		],
	},
];

const main = async () => {
	const engine = new Engine('Test Engine', rules);

	console.log(await engine.evaluate(facts));
	/*{
    elapsed: 6,
    fired: [
        {
        name: 'Mood Great',
        fired: true,
        discarted: false,
        actions: [Array]
        }
    ],
    context: { data: { user: [Object], weather: [Object] }, extra: {} }
    } 
    */
};

main();
```

These are the resulting facts:

```javascript
{
    elapsed: 6,
    fired: [
        {
        name: 'Mood Great',
        fired: true,
        discarted: false,
        actions: [Array]
        }
    ],
    context: { data: { user: [Object], weather: [Object] }, extra: {} }
    }
```

## Features

### Rule engine

The engine utilizes forward-chaining methodology and operates within a typical match-resolve-act cycle. It endeavors to infer the maximum amount of information feasible from the provided facts and regulations. If there is no additional knowledge to acquire, the process concludes.

### Final rules

For optimization purposes, it can be useful to stop the engine as soon as a specific rule has fired.
This can be achieved by settings the respective rules' property `final` to `true`.
Default, of course, is `false`.

### Activation groups

Only one rule within an activation group will fire during a match-resolve-act cycle, i.e.,
the first one to fire discards all other rules within the same activation group.
Use the rule's `activationGroup` property to set its activation group.
