import React, { useState } from "react";
import { maps } from "../utils/bank";
import utils from "../utils/utils";

export default function MapBuilder(props: { name: string }) {
  const ref = React.useRef<HTMLImageElement>(null);
  const [m, update] = useState(maps.find((m) => m.name === props.name)!);
  return (
    <div>
      <div>
        <pre>{JSON.stringify(m)}</pre>
      </div>
      <div style={{ position: "relative" }}>
        {ref.current === null ? null : (
          <>
            {m.cities
              .map((c) => ({
                ...c,
                x: c.x * ref.current!.width,
                y: c.y * ref.current!.height,
              }))
              .map((c, i) => (
                <div
                  key={i}
                  style={{
                    ...utils.bubbleStyle,
                    position: "absolute",
                    margin: 0,
                    transform: "translate(-50%,-100%)",
                    left: c.x,
                    top: c.y,
                  }}
                >
                  {c.name}
                </div>
              ))}

            {m.edges
              .map((e) => ({
                cost: e.cost,
                cs: [e.c1, e.c2]
                  .map((name) => m.cities.find((c) => name === c.name)!)
                  .map(
                    (c) =>
                      c && {
                        ...c,
                        x: c.x * ref.current!.width,
                        y: c.y * ref.current!.height,
                      }
                  ),
              }))
              .filter(({ cs }) => cs[0] && cs[1])
              .map(({ cs, ...o }) => ({
                ...o,
                cs,
                diff: [cs[1].x - cs[0].x, cs[1].y - cs[0].y],
              }))
              .map(({ diff, ...o }) => ({
                ...o,
                width: Math.pow(
                  diff.map((d) => Math.pow(d, 2)).reduce((a, b) => a + b, 0),
                  0.5
                ),
                angleDeg: (Math.atan2(diff[1], diff[0]) * 180) / Math.PI,
              }))
              .map(({ cost, cs, width, angleDeg }, i) => (
                <div
                  key={i}
                  style={{
                    ...utils.bubbleStyle,
                    position: "absolute",
                    margin: 0,
                    padding: 0,
                    left: (cs[0].x + cs[1].x - width) / 2,
                    top: (cs[0].y + cs[1].y) / 2,
                    width,
                    transform: `rotate(${angleDeg}deg) translate(0%, -50%)`,
                    textAlign: "center",
                  }}
                >
                  {cost}
                </div>
              ))}
          </>
        )}

        <img
          ref={ref}
          alt={props.name}
          src={m.img}
          onLoad={() => update({ ...m })}
          onClick={(e) =>
            Promise.resolve()
              .then(() =>
                ((target) => [
                  e.nativeEvent.offsetX / target.width,
                  e.nativeEvent.offsetY / target.height,
                ])(e.target as HTMLImageElement)
              )
              .then(([x, y]) => {
                const close = m.cities.find(
                  (c) =>
                    [c.x - x, c.y - y]
                      .map((i) => Math.pow(i, 2))
                      .reduce((a, b) => a + b, 0) < 0.001
                );
                if (close === undefined) {
                  m.cities.push({
                    color: "",
                    name: m.cities.length.toString(),
                    x,
                    y,
                  });
                } else {
                  const edge = m.edges.find((e) => e.cost < 0);
                  if (edge === undefined) {
                    m.edges.push({
                      c1: close.name,
                      c2: m.edges.length.toString(),
                      cost: -1,
                    });
                  } else {
                    edge.c2 = close.name;
                    edge.cost = 0;
                  }
                }
                update({ ...m });
              })
              .then(() => console.log(m))
          }
        />
      </div>
    </div>
  );
}
