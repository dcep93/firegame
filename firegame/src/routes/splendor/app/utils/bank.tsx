export enum Token {
	green,
	blue,
	red,
	white,
	black,
	gold,
}

export type Card = {
	level: number;
	color: Token;
	points: number;
	price: { [t in Token]?: number };
};

export type TokensGroup = { [t in Token]?: number };

const cards = [
	{
		level: 1,
		color: Token.black,
		points: 0,
		price: {
			[Token.white]: 1,
			[Token.blue]: 1,
			[Token.green]: 1,
			[Token.red]: 1,
		},
	},
	{
		level: 1,
		color: Token.black,
		points: 0,
		price: {
			[Token.white]: 1,
			[Token.blue]: 2,
			[Token.green]: 1,
			[Token.red]: 1,
		},
	},
	{
		level: 1,
		color: Token.black,
		points: 0,
		price: { [Token.white]: 2, [Token.blue]: 2, [Token.red]: 1 },
	},
	{
		level: 1,
		color: Token.black,
		points: 0,
		price: { [Token.green]: 1, [Token.red]: 3, [Token.black]: 1 },
	},
	{
		level: 1,
		color: Token.black,
		points: 0,
		price: { [Token.green]: 2, [Token.red]: 1 },
	},
	{
		level: 1,
		color: Token.black,
		points: 0,
		price: { [Token.white]: 2, [Token.green]: 2 },
	},
	{ level: 1, color: Token.black, points: 0, price: { [Token.green]: 3 } },
	{ level: 1, color: Token.black, points: 1, price: { [Token.blue]: 4 } },
	{
		level: 1,
		color: Token.blue,
		points: 0,
		price: {
			[Token.white]: 1,
			[Token.green]: 1,
			[Token.red]: 1,
			[Token.black]: 1,
		},
	},
	{
		level: 1,
		color: Token.blue,
		points: 0,
		price: {
			[Token.white]: 1,
			[Token.green]: 1,
			[Token.red]: 2,
			[Token.black]: 1,
		},
	},
	{
		level: 1,
		color: Token.blue,
		points: 0,
		price: { [Token.white]: 1, [Token.green]: 2, [Token.red]: 2 },
	},
	{
		level: 1,
		color: Token.blue,
		points: 0,
		price: { [Token.blue]: 1, [Token.green]: 3, [Token.red]: 1 },
	},
	{
		level: 1,
		color: Token.blue,
		points: 0,
		price: { [Token.white]: 1, [Token.black]: 2 },
	},
	{
		level: 1,
		color: Token.blue,
		points: 0,
		price: { [Token.green]: 2, [Token.black]: 2 },
	},
	{ level: 1, color: Token.blue, points: 0, price: { [Token.black]: 3 } },
	{ level: 1, color: Token.blue, points: 1, price: { [Token.red]: 4 } },
	{
		level: 1,
		color: Token.white,
		points: 0,
		price: {
			[Token.blue]: 1,
			[Token.green]: 1,
			[Token.red]: 1,
			[Token.black]: 1,
		},
	},
	{
		level: 1,
		color: Token.white,
		points: 0,
		price: {
			[Token.blue]: 1,
			[Token.green]: 2,
			[Token.red]: 1,
			[Token.black]: 1,
		},
	},
	{
		level: 1,
		color: Token.white,
		points: 0,
		price: { [Token.blue]: 2, [Token.green]: 2, [Token.black]: 1 },
	},
	{
		level: 1,
		color: Token.white,
		points: 0,
		price: { [Token.white]: 3, [Token.blue]: 1, [Token.black]: 1 },
	},
	{
		level: 1,
		color: Token.white,
		points: 0,
		price: { [Token.red]: 2, [Token.black]: 1 },
	},
	{
		level: 1,
		color: Token.white,
		points: 0,
		price: { [Token.blue]: 2, [Token.black]: 2 },
	},
	{ level: 1, color: Token.white, points: 0, price: { [Token.blue]: 3 } },
	{ level: 1, color: Token.white, points: 1, price: { [Token.green]: 4 } },
	{
		level: 1,
		color: Token.green,
		points: 0,
		price: {
			[Token.white]: 1,
			[Token.blue]: 1,
			[Token.red]: 1,
			[Token.black]: 1,
		},
	},
	{
		level: 1,
		color: Token.green,
		points: 0,
		price: {
			[Token.white]: 1,
			[Token.blue]: 1,
			[Token.red]: 1,
			[Token.black]: 2,
		},
	},
	{
		level: 1,
		color: Token.green,
		points: 0,
		price: { [Token.blue]: 1, [Token.red]: 2, [Token.black]: 2 },
	},
	{
		level: 1,
		color: Token.green,
		points: 0,
		price: { [Token.white]: 1, [Token.blue]: 3, [Token.green]: 1 },
	},
	{
		level: 1,
		color: Token.green,
		points: 0,
		price: { [Token.white]: 2, [Token.blue]: 1 },
	},
	{
		level: 1,
		color: Token.green,
		points: 0,
		price: { [Token.blue]: 2, [Token.red]: 2 },
	},
	{ level: 1, color: Token.green, points: 0, price: { [Token.red]: 3 } },
	{ level: 1, color: Token.green, points: 1, price: { [Token.black]: 4 } },
	{
		level: 1,
		color: Token.red,
		points: 0,
		price: {
			[Token.white]: 1,
			[Token.blue]: 1,
			[Token.green]: 1,
			[Token.black]: 1,
		},
	},
	{
		level: 1,
		color: Token.red,
		points: 0,
		price: {
			[Token.white]: 2,
			[Token.blue]: 1,
			[Token.green]: 1,
			[Token.black]: 1,
		},
	},
	{
		level: 1,
		color: Token.red,
		points: 0,
		price: { [Token.white]: 2, [Token.green]: 1, [Token.black]: 2 },
	},
	{
		level: 1,
		color: Token.red,
		points: 0,
		price: { [Token.white]: 1, [Token.red]: 1, [Token.black]: 3 },
	},
	{
		level: 1,
		color: Token.red,
		points: 0,
		price: { [Token.blue]: 2, [Token.green]: 1 },
	},
	{
		level: 1,
		color: Token.red,
		points: 0,
		price: { [Token.white]: 2, [Token.red]: 2 },
	},
	{ level: 1, color: Token.red, points: 0, price: { [Token.white]: 3 } },
	{ level: 1, color: Token.red, points: 1, price: { [Token.white]: 4 } },
	{
		level: 2,
		color: Token.black,
		points: 1,
		price: { [Token.white]: 3, [Token.blue]: 2, [Token.green]: 2 },
	},
	{
		level: 2,
		color: Token.black,
		points: 1,
		price: { [Token.white]: 3, [Token.green]: 3, [Token.black]: 2 },
	},
	{
		level: 2,
		color: Token.black,
		points: 2,
		price: { [Token.blue]: 1, [Token.green]: 4, [Token.red]: 2 },
	},
	{
		level: 2,
		color: Token.black,
		points: 2,
		price: { [Token.green]: 5, [Token.red]: 3 },
	},
	{ level: 2, color: Token.black, points: 2, price: { [Token.white]: 5 } },
	{ level: 2, color: Token.black, points: 3, price: { [Token.black]: 6 } },
	{
		level: 2,
		color: Token.blue,
		points: 1,
		price: { [Token.blue]: 2, [Token.green]: 2, [Token.red]: 3 },
	},
	{
		level: 2,
		color: Token.blue,
		points: 1,
		price: { [Token.blue]: 2, [Token.green]: 3, [Token.black]: 3 },
	},
	{
		level: 2,
		color: Token.blue,
		points: 2,
		price: { [Token.white]: 5, [Token.blue]: 3 },
	},
	{
		level: 2,
		color: Token.blue,
		points: 2,
		price: { [Token.white]: 2, [Token.red]: 1, [Token.black]: 4 },
	},
	{ level: 2, color: Token.blue, points: 2, price: { [Token.blue]: 5 } },
	{ level: 2, color: Token.blue, points: 3, price: { [Token.blue]: 6 } },
	{
		level: 2,
		color: Token.white,
		points: 1,
		price: { [Token.green]: 3, [Token.red]: 2, [Token.black]: 2 },
	},
	{
		level: 2,
		color: Token.white,
		points: 1,
		price: { [Token.white]: 2, [Token.blue]: 3, [Token.red]: 3 },
	},
	{
		level: 2,
		color: Token.white,
		points: 2,
		price: { [Token.green]: 1, [Token.red]: 4, [Token.black]: 2 },
	},
	{
		level: 2,
		color: Token.white,
		points: 2,
		price: { [Token.red]: 5, [Token.black]: 3 },
	},
	{ level: 2, color: Token.white, points: 2, price: { [Token.red]: 5 } },
	{ level: 2, color: Token.white, points: 3, price: { [Token.white]: 6 } },
	{
		level: 2,
		color: Token.green,
		points: 1,
		price: { [Token.white]: 3, [Token.green]: 2, [Token.red]: 3 },
	},
	{
		level: 2,
		color: Token.green,
		points: 1,
		price: { [Token.white]: 2, [Token.blue]: 3, [Token.black]: 2 },
	},
	{
		level: 2,
		color: Token.green,
		points: 2,
		price: { [Token.white]: 4, [Token.blue]: 2, [Token.black]: 1 },
	},
	{
		level: 2,
		color: Token.green,
		points: 2,
		price: { [Token.blue]: 5, [Token.green]: 3 },
	},
	{ level: 2, color: Token.green, points: 2, price: { [Token.green]: 5 } },
	{ level: 2, color: Token.green, points: 3, price: { [Token.green]: 6 } },
	{
		level: 2,
		color: Token.red,
		points: 1,
		price: { [Token.white]: 2, [Token.red]: 2, [Token.black]: 3 },
	},
	{
		level: 2,
		color: Token.red,
		points: 1,
		price: { [Token.blue]: 3, [Token.red]: 2, [Token.black]: 3 },
	},
	{
		level: 2,
		color: Token.red,
		points: 2,
		price: { [Token.white]: 1, [Token.blue]: 4, [Token.green]: 2 },
	},
	{
		level: 2,
		color: Token.red,
		points: 2,
		price: { [Token.white]: 3, [Token.black]: 5 },
	},
	{ level: 2, color: Token.red, points: 2, price: { [Token.black]: 5 } },
	{ level: 2, color: Token.red, points: 3, price: { [Token.red]: 6 } },
	{
		level: 3,
		color: Token.black,
		points: 3,
		price: {
			[Token.white]: 3,
			[Token.blue]: 3,
			[Token.green]: 5,
			[Token.red]: 3,
		},
	},
	{ level: 3, color: Token.black, points: 4, price: { [Token.red]: 7 } },
	{
		level: 3,
		color: Token.black,
		points: 4,
		price: { [Token.green]: 3, [Token.red]: 6, [Token.black]: 3 },
	},
	{
		level: 3,
		color: Token.black,
		points: 5,
		price: { [Token.red]: 7, [Token.black]: 3 },
	},
	{
		level: 3,
		color: Token.blue,
		points: 3,
		price: {
			[Token.white]: 3,
			[Token.green]: 3,
			[Token.red]: 3,
			[Token.black]: 5,
		},
	},
	{ level: 3, color: Token.blue, points: 4, price: { [Token.white]: 7 } },
	{
		level: 3,
		color: Token.blue,
		points: 4,
		price: { [Token.white]: 6, [Token.blue]: 3, [Token.black]: 3 },
	},
	{
		level: 3,
		color: Token.blue,
		points: 5,
		price: { [Token.white]: 7, [Token.blue]: 3 },
	},
	{
		level: 3,
		color: Token.white,
		points: 3,
		price: {
			[Token.blue]: 3,
			[Token.green]: 3,
			[Token.red]: 5,
			[Token.black]: 3,
		},
	},
	{ level: 3, color: Token.white, points: 4, price: { [Token.black]: 7 } },
	{
		level: 3,
		color: Token.white,
		points: 4,
		price: { [Token.white]: 3, [Token.red]: 3, [Token.black]: 6 },
	},
	{
		level: 3,
		color: Token.white,
		points: 5,
		price: { [Token.white]: 3, [Token.black]: 7 },
	},
	{
		level: 3,
		color: Token.green,
		points: 3,
		price: {
			[Token.white]: 5,
			[Token.blue]: 3,
			[Token.red]: 3,
			[Token.black]: 3,
		},
	},
	{ level: 3, color: Token.green, points: 4, price: { [Token.blue]: 7 } },
	{
		level: 3,
		color: Token.green,
		points: 4,
		price: { [Token.white]: 3, [Token.blue]: 6, [Token.green]: 3 },
	},
	{
		level: 3,
		color: Token.green,
		points: 5,
		price: { [Token.blue]: 7, [Token.green]: 3 },
	},
	{
		level: 3,
		color: Token.red,
		points: 3,
		price: {
			[Token.white]: 3,
			[Token.blue]: 5,
			[Token.green]: 3,
			[Token.black]: 3,
		},
	},
	{ level: 3, color: Token.red, points: 4, price: { [Token.green]: 7 } },
	{
		level: 3,
		color: Token.red,
		points: 4,
		price: { [Token.blue]: 3, [Token.green]: 6, [Token.red]: 3 },
	},
	{
		level: 3,
		color: Token.red,
		points: 5,
		price: { [Token.green]: 7, [Token.red]: 3 },
	},
];

const nobles = [
	{ [Token.green]: 4, [Token.blue]: 4 },
	{ [Token.green]: 4, [Token.red]: 4 },
	{ [Token.green]: 4, [Token.white]: 4 },
	{ [Token.green]: 4, [Token.black]: 4 },
	{ [Token.blue]: 4, [Token.red]: 4 },
	{ [Token.blue]: 4, [Token.white]: 4 },
	{ [Token.blue]: 4, [Token.black]: 4 },
	{ [Token.red]: 4, [Token.white]: 4 },
	{ [Token.red]: 4, [Token.black]: 4 },
	{ [Token.white]: 4, [Token.black]: 4 },
	{ [Token.green]: 3, [Token.blue]: 3, [Token.red]: 3 },
	{ [Token.green]: 3, [Token.blue]: 3, [Token.white]: 3 },
	{ [Token.green]: 3, [Token.blue]: 3, [Token.black]: 3 },
	{ [Token.green]: 3, [Token.red]: 3, [Token.white]: 3 },
	{ [Token.green]: 3, [Token.red]: 3, [Token.black]: 3 },
	{ [Token.green]: 3, [Token.white]: 3, [Token.black]: 3 },
	{ [Token.blue]: 3, [Token.red]: 3, [Token.white]: 3 },
	{ [Token.blue]: 3, [Token.red]: 3, [Token.black]: 3 },
	{ [Token.blue]: 3, [Token.white]: 3, [Token.black]: 3 },
	{ [Token.red]: 3, [Token.white]: 3, [Token.black]: 3 },
];

export default { nobles, cards };