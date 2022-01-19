import React from "react";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import { Cities, City, Map } from "../utils/bank";
import utils from "../utils/utils";

function Board() {
  return (
    <div className={styles.bubble}>
      <div className={css.board}>
        {utils
          .enumArray(City)
          .map((city: City) => ({ city, name: Cities[city].name }))
          .map((obj, i) => (
            <div
              key={i}
              className={css.city}
              title={obj.name}
              style={{ ...getStyle(obj.city) }}
            >
              {obj.name}
            </div>
          ))}

        <img src={Map.src} alt=""></img>
      </div>
    </div>
  );
}

function getStyle(city: City): { top: number; left: number } {
  const mapRef = Map.refs[city];
  if (mapRef !== undefined) return mapRef;
  const target = Cities[city];
  const [ref1, ref2] = Object.entries(Map.refs)
    .map(([c, mapRef]) => ({
      c: parseInt(c) as City,
      mapRef: mapRef!,
    }))
    .map((obj) => ({ ...obj, cObj: Cities[obj.c] }))
    .map((obj) => ({
      ...obj,
      dist:
        Math.pow(obj.cObj.latitude - target.latitude, 2) +
        Math.pow(obj.cObj.longitude - target.longitude, 2),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 2);
  const weightX =
    (target.longitude - ref2.cObj.longitude) /
    (ref1.cObj.longitude - ref2.cObj.longitude);
  const weightY =
    (target.latitude - ref2.cObj.latitude) /
    (ref1.cObj.latitude - ref2.cObj.latitude);
  const top = ref1.mapRef.top * weightY + ref2.mapRef.top * (1 - weightY);
  const left = ref1.mapRef.left * weightX + ref2.mapRef.left * (1 - weightX);
  return { top, left };
}

export default Board;
