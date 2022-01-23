import React, { useState } from "react";
import styles from "../../../../shared/styles.module.css";
import css from "../index.module.css";
import {
  Cities,
  City,
  CityType,
  Color,
  Map,
  Routes,
  RouteType,
} from "../utils/bank";
import utils, { store } from "../utils/utils";

function Board(props: {
  selected: { [n: number]: boolean };
  update: (selected: { [n: number]: boolean }) => void;
}) {
  const [scaleIndex, update] = useState(0);
  const width = Map.baseWidth * Map.scales[scaleIndex];
  return (
    <div>
      <div
        className={[styles.bubble, css.board].join(" ")}
        onClick={(e) => {
          if (true) {
            const newScale = (scaleIndex + 1) % Map.scales.length;
            update(newScale);
          } else {
            console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          }
        }}
      >
        <div className={css.overlay}>
          {Routes.map((r, i) => (
            <Route
              key={i}
              route={r}
              routeIndex={i}
              selected={props.selected}
              update={props.update}
              scale={Map.scales[scaleIndex]}
            />
          ))}
          {utils
            .enumArray(City)
            .map((city: City) => ({ city, name: Cities[city].name }))
            .map((obj, i) => (
              <div
                key={i}
                className={css.city}
                title={obj.name}
                style={{ ...getCoords(obj.city, Map.scales[scaleIndex]) }}
              >
                {obj.name}
              </div>
            ))}
        </div>

        <img style={{ width }} className={css.img} src={Map.src} alt=""></img>
      </div>
    </div>
  );
}

function getCoords(city: City, scale: number): { top: number; left: number } {
  var coords = getCoordsHelper(city);
  return { top: coords.top * scale, left: coords.left * scale };
}

function getCoordsHelper(city: City): { top: number; left: number } {
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

function Route(props: {
  route: RouteType;
  routeIndex: number;
  selected: { [n: number]: boolean };
  update: (selected: { [n: number]: boolean }) => void;
  scale: number;
}) {
  var startCoords = getCoords(props.route.start, props.scale);
  var endCoords = getCoords(props.route.end, props.scale);
  if (startCoords.left > endCoords.left)
    [startCoords, endCoords] = [endCoords, startCoords];
  const mapCities = [startCoords, endCoords].map((c) => ({
    name: "",
    latitude: c.top,
    longitude: c.left,
  }));
  const width = getDistance(mapCities[0], mapCities[1]);
  var angleDeg = (getAngle(mapCities[0], mapCities[1]) * 180) / Math.PI;
  return (
    <div
      className={css.route}
      style={{
        ...startCoords,
        width,
        transform: `rotate(${angleDeg}deg) translate(0%, -50%)`,
      }}
    >
      {props.route.colors.map((c, i) => (
        <SubRoute
          key={i}
          routeIndex={props.routeIndex}
          colorIndex={i}
          selected={props.selected}
          update={props.update}
        />
      ))}
    </div>
  );
}

function SubRoute(props: {
  routeIndex: number;
  colorIndex: number;
  selected: { [n: number]: boolean };
  update: (selected: { [n: number]: boolean }) => void;
}) {
  const route = Routes[props.routeIndex];
  const color = route.colors[props.colorIndex];
  const owned = store.gameW.game.players.find((p) =>
    (p.routeIndices || []).find(
      (r) =>
        r.routeIndex === props.routeIndex && r.colorIndex === props.colorIndex
    )
  );
  const style =
    owned === undefined
      ? { backgroundColor: utils.backgroundColor(color) }
      : {
          background: `repeating-linear-gradient(-45deg, white 0 20px, ${utils.backgroundColor(
            owned.color
          )} 20px 40px)`,
        };
  const messageParts = [route.length, "🚂"];
  const title = [
    `${Cities[route.start].name} → ${Cities[route.end].name}`,
    route.length,
    Color[route.colors[props.colorIndex]],
  ];
  if (owned !== undefined) {
    messageParts.push(owned.userName);
    title.push(owned.userName);
  }
  return (
    <div
      style={style}
      className={[
        styles.bubble,
        css.subroute,
        color === Color.rainbow && css.rainbow,
      ].join(" ")}
      onClick={(e) => {
        e.stopPropagation();
        utils.buyRoute(
          props.routeIndex,
          props.colorIndex,
          props.selected,
          props.update
        );
      }}
      title={title.join("\n")}
    >
      <span>{messageParts.join(" / ")}</span>
    </div>
  );
}

export default Board;
