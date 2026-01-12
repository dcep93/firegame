import React from "react";
import {
  ResourceCard,
  ResourceCounts,
  RollType,
  Tile,
} from "../utils/NewGame";
import utils, { store } from "../utils/utils";
import css from "../index.module.css";

const resourceColors: Record<Tile["resource"], string> = {
  wood: "#7fb069",
  sheep: "#cbe896",
  wheat: "#f4d35e",
  brick: "#d1665a",
  ore: "#8d99ae",
  desert: "#d9c38f",
};

const rowLayout = [3, 4, 5, 4, 3];

function Main() {
  const game = store.gameW.game;
  let tileIndex = 0;
  const currentPlayer = utils.getCurrent(game);
  const me = utils.getMe(game);

  const canRoll = utils.isMyTurn(game) && !game.hasRolled;
  const canAct = utils.isMyTurn(game) && game.hasRolled;

  const totalResources = (resources: ResourceCounts) =>
    Object.values(resources).reduce((sum, value) => sum + value, 0);

  const canAfford = (cost: Partial<ResourceCounts>) =>
    Object.entries(cost).every(([resource, amount]) => {
      const key = resource as ResourceCard;
      return game.players[game.currentPlayer].resources[key] >= (amount || 0);
    });

  const applyCost = (cost: Partial<ResourceCounts>) => {
    Object.entries(cost).forEach(([resource, amount]) => {
      const key = resource as ResourceCard;
      game.players[game.currentPlayer].resources[key] -= amount || 0;
    });
  };

  const rollDice = () => {
    if (!canRoll) return;
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;
    const roll: RollType = {
      dice: [die1, die2],
      total,
      playerIndex: game.currentPlayer,
    };
    game.hasRolled = true;
    game.lastRoll = roll;

    const gained: ResourceCard[] = [];
    if (total !== 7) {
      game.tiles.forEach((tile) => {
        if (tile.number === total && tile.resource !== "desert") {
          const resource = tile.resource as ResourceCard;
          game.players[game.currentPlayer].resources[resource] += 1;
          gained.push(resource);
        }
      });
    }

    const gainSummary =
      gained.length > 0
        ? `and collected ${gained.join(", ")}`
        : total === 7
        ? "and triggered a 7 (no resources)"
        : "and found no matching tiles";

    store.update(
      `rolled ${total} (${die1} + ${die2}) ${gainSummary}`.trim()
    );
  };

  const endTurn = () => {
    if (!canAct) return;
    utils.incrementPlayerTurn(game);
    game.hasRolled = false;
    store.update("ended their turn");
  };

  const buildRoad = () => {
    if (!canAct) return;
    const cost = { brick: 1, wood: 1 };
    if (!canAfford(cost)) return;
    applyCost(cost);
    game.players[game.currentPlayer].roads += 1;
    store.update("built a road");
  };

  const buildSettlement = () => {
    if (!canAct) return;
    const cost = { brick: 1, wood: 1, sheep: 1, wheat: 1 };
    if (!canAfford(cost)) return;
    applyCost(cost);
    game.players[game.currentPlayer].settlements += 1;
    game.players[game.currentPlayer].victoryPoints += 1;
    store.update("built a settlement");
  };

  const upgradeCity = () => {
    if (!canAct) return;
    const cost = { ore: 3, wheat: 2 };
    if (
      !canAfford(cost) ||
      game.players[game.currentPlayer].settlements < 1
    )
      return;
    applyCost(cost);
    game.players[game.currentPlayer].settlements -= 1;
    game.players[game.currentPlayer].cities += 1;
    game.players[game.currentPlayer].victoryPoints += 1;
    store.update("upgraded to a city");
  };

  return (
    <div className={css.wrapper}>
      <div className={css.statusCard}>
        <div>
          Current player: <strong>{currentPlayer.userName}</strong>
        </div>
        <div>
          Last roll:{" "}
          <strong>
            {game.lastRoll
              ? `${game.lastRoll.total} (${game.lastRoll.dice.join(" + ")})`
              : "—"}
          </strong>
        </div>
        <div>
          Your hand:{" "}
          <strong>{totalResources(me.resources)} cards</strong>
        </div>
      </div>
      <div className={css.actions}>
        <button onClick={rollDice} disabled={!canRoll}>
          Roll dice
        </button>
        <button onClick={buildRoad} disabled={!canAct || !canAfford({
          brick: 1,
          wood: 1,
        })}>
          Build road (1 brick, 1 wood)
        </button>
        <button
          onClick={buildSettlement}
          disabled={
            !canAct ||
            !canAfford({ brick: 1, wood: 1, sheep: 1, wheat: 1 })
          }
        >
          Build settlement (brick, wood, sheep, wheat)
        </button>
        <button
          onClick={upgradeCity}
          disabled={
            !canAct ||
            !canAfford({ ore: 3, wheat: 2 }) ||
            game.players[game.currentPlayer].settlements < 1
          }
        >
          Upgrade to city (3 ore, 2 wheat)
        </button>
        <button onClick={endTurn} disabled={!canAct}>
          End turn
        </button>
      </div>
      <div className={css.players}>
        {game.players.map((player, index) => (
          <div
            key={player.userId}
            className={[
              css.playerCard,
              index === game.currentPlayer ? css.activePlayer : "",
            ].join(" ")}
          >
            <div className={css.playerHeader}>
              <strong>{player.userName}</strong>
              {index === utils.myIndex(game) && (
                <span className={css.playerBadge}>You</span>
              )}
            </div>
            <div className={css.playerStats}>
              <span>{player.victoryPoints} VP</span>
              <span>{player.settlements} settlements</span>
              <span>{player.cities} cities</span>
              <span>{player.roads} roads</span>
            </div>
            <div className={css.resourceGrid}>
              {Object.entries(player.resources).map(([resource, amount]) => (
                <div key={resource} className={css.resourceItem}>
                  <span className={css.resourceLabel}>{resource}</span>
                  <span className={css.resourceCount}>{amount}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={css.settings}>
        Cities &amp; Knights:{" "}
        <strong>{game.params.citiesAndKnights ? "Enabled" : "Off"}</strong>
      </div>
      <div className={css.board}>
        {rowLayout.map((count, rowIndex) => {
          const tiles = game.tiles.slice(tileIndex, tileIndex + count);
          tileIndex += count;
          return (
            <div key={`row-${rowIndex}`} className={css.row}>
              {tiles.map((tile, index) => (
                <div
                  key={`tile-${rowIndex}-${index}`}
                  className={css.tile}
                  style={{ backgroundColor: resourceColors[tile.resource] }}
                >
                  <div className={css.tileResource}>{tile.resource}</div>
                  {tile.number !== undefined && (
                    <div className={css.tileNumber}>{tile.number}</div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Main;
