import { maps } from "../utils/bank";

export default function MapBuilder(props: { name: string }) {
  const m = maps.find((m) => m.name === props.name)!;
  return (
    <div>
      <img
        src={m.img}
        onClick={(e) =>
          Promise.resolve()
            .then(() => [e.nativeEvent.offsetX, e.nativeEvent.offsetY])
            .then(([x, y]) => {
              const close = m.cities.find(
                (c) =>
                  [c.x - x, c.y - y]
                    .map((i) => Math.pow(i, 2))
                    .reduce((a, b) => a + b, 0) < 1000
              );
              if (close === undefined) {
                m.cities.push({ name: "", x, y });
              } else {
                const edge = m.edges.find((e) => e.cost < 0);
                if (edge === undefined) {
                  m.edges.push({ c1: close.name, c2: "", cost: -1 });
                } else {
                  edge.c2 = close.name;
                  edge.cost = 0;
                }
              }
            })
            .then(() => console.log(m))
        }
      />
    </div>
  );
}
