export type Bean = {
  name: string;
  index: number;
  quantity: number;
  earnings: number[];
};

const beans: Bean[] = [
  { name: "Soy Bean", quantity: 12, earnings: [2, 4, 6, 7] },
  { name: "Stink Bean", quantity: 16, earnings: [3, 5, 7, 8] },
].map((b, i) => ({ ...b, index: i }));

export default beans;
