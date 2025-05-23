import utils, { store } from "../utils/utils";

export default function Board() {
  const map = utils.getMap();
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
          {map.cities.map((c, i) => (
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
                ...((store.gameW.game.outOfPlayZones || []).includes(
                  utils.getMap().cities[i].color
                )
                  ? { backgroundColor: "black" }
                  : {}),
              }}
              onClick={() => utils.buyCity(true, i)}
            >
              <div
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-100%)",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                {store.gameW.game.players
                  .concat(store.gameW.game.twoPlayer_trust || [])
                  .flatMap((p) =>
                    (p.cityIndices || []).map((cc) => ({ cc, p }))
                  )
                  .filter(({ cc }) => i === cc)
                  .map(({ p }, j) => (
                    <div
                      key={j}
                      style={{
                        backgroundColor: p.color,
                        height: "1em",
                        width: "1em",
                        display: "inline-block",
                      }}
                    ></div>
                  ))}
              </div>
            </div>
          ))}
          <img
            style={{
              width: "100%",
              display: "block",
              objectFit: "contain",
            }}
            src={map.img}
            alt={map.name}
          />
        </div>
      </div>
    </div>
  );
}
