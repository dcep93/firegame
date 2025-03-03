import { BoardMap } from "../utils/bank";
import utils from "../utils/utils";

export default function Board(props: { map: BoardMap }) {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          maxHeight: "100%",
          overflowY: "scroll",
        }}
      >
        <div
          style={{
            height: "100%",
            position: "relative",
          }}
        >
          {props.map.cities.map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${c.x * 100}%`,
                top: `${c.y * 100}%`,
                borderRadius: "100%",
                transform: "translate(-50%,-50%)",
                width: "4em",
                height: "4em",
                cursor: utils.buyCity(false, i) ? "pointer" : undefined,
              }}
              onClick={() => utils.buyCity(true, i)}
            ></div>
          ))}
          <img
            style={{
              width: "100%",
              display: "block",
              objectFit: "contain",
            }}
            src={props.map.img}
            alt={props.map.name}
          />
        </div>
      </div>
    </div>
  );
}
