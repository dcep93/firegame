import React from "react";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import { Cities, City, CityType, Map } from "../utils/bank";
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
  const mapRef = Map.refs.find((obj) => obj.city === city);
  if (mapRef !== undefined) return mapRef;
  const target = Cities[city];
  const [ref1, ref2] = Map.refs
    .map((obj) => ({
      ...obj,
      mapCity: { name: "", latitude: -obj.top, longitude: obj.left },
      cObj: Cities[obj.city],
    }))
    .map((obj) => ({
      ...obj,
      dist: getDistance(obj.cObj, target),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 2);
  const angle =
    getAngle(ref1.mapCity, ref2.mapCity) -
    getAngle(ref1.cObj, ref2.cObj) +
    getAngle(ref1.cObj, target);
  const distance =
    (ref1.dist * getDistance(ref1.mapCity, ref2.mapCity)) /
    getDistance(ref1.cObj, ref2.cObj);
  const top = ref1.top - distance * Math.sin(angle);
  const left = ref1.left + distance * Math.cos(angle);
  return { top, left };
}

function getDistance(city1: CityType, city2: CityType): number {
  return Math.pow(
    Math.pow(city1.latitude - city2.latitude, 2) +
      Math.pow(city1.longitude - city2.longitude, 2),
    0.5
  );
}

function getAngle(city1: CityType, city2: CityType): number {
  return Math.atan2(
    city2.latitude - city1.latitude,
    city2.longitude - city1.longitude
  );
}

export default Board;
