import { BoardMap } from "../utils/bank";

export default function Board(props: { map: BoardMap }) {
  console.log(
    props.map.cities.map((c) => ({ ...c, x: c.x / 1536, y: c.y / 2048 }))
  );
  return (
    <div>
      <div
        style={{
          position: "absolute",
          maxHeight: "100%",
          overflowY: "scroll",
          backgroundColor: "blue",
        }}
      >
        <div style={{ height: "100%", backgroundColor: "green" }}>
          {props.map.cities.map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${c.x * 100}%`,
                marginTop: `${c.y * 100}%`,
              }}
            >
              {c.name}
            </div>
          ))}
          <img
            style={{
              width: "100%",
              display: "block",
              objectFit: "contain",
              opacity: 0.5,
            }}
            src={props.map.img}
            alt={props.map.name}
          />
        </div>
      </div>
    </div>
  );
}
