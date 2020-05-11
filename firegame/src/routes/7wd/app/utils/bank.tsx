import { CardType, Color, Age, Resource } from "./NewGame";

const map: { [age in Age]?: number[][] } = {
	[Age.one]: [
		[4, 6],
		[3, 5, 7],
		[2, 4, 6, 8],
		[1, 3, 5, 7, 9],
		[0, 2, 4, 6, 8, 10],
	],
	[Age.two]: [
		[0, 2, 4, 6, 8, 10],
		[1, 3, 5, 7, 9],
		[2, 4, 6, 8],
		[3, 5, 7],
		[4, 6],
	],
	[Age.three]: [
		[2, 4],
		[1, 3, 5],
		[0, 2, 4, 6],
		[1, 5],
		[0, 2, 4, 6],
		[1, 3, 5],
		[2, 4],
	],
};

const ly = {
	name: "lumber yard",
	age: Age.one,
	color: Color.brown,
	cost: {},
	resource: [Resource.wood],
};
const bank: { [age in Age]?: CardType[] } = {
	[Age.one]: [
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
		ly,
	],
};

export default { bank, map };
