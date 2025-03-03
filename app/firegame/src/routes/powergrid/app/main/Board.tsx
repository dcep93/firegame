import { maps } from "../utils/bank";
import { store } from "../utils/utils";

export default function Board() {
  return (
    <div
      style={{
        position: "absolute",
        maxHeight: "100%",
        overflowY: "scroll",
      }}
    >
      <img
        style={{
          width: "100%",
          display: "block",
          objectFit: "contain",
          opacity: 0.5,
        }}
        src={maps.find((m) => m.name === store.gameW.game.mapName)!.img}
        alt={store.gameW.game.mapName}
      />
    </div>
  );
}
