import { CardType, Color, Age, Resource } from "./NewGame";

const map: { [age in Age]?: number[][] } = {
	[Age.one]: [
		[4, 4],
		[3, 3, 3],
		[2, 2, 2, 2],
		[1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 0],
	],
	[Age.two]: [
		[0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1],
		[2, 2, 2, 2],
		[3, 3, 3],
		[4, 4],
	],
	[Age.three]: [
		[2, 2],
		[1, 1, 1],
		[0, 0, 0, 0],
		[1, 3],
		[0, 0, 0, 0],
		[1, 1, 1],
		[2, 2],
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
