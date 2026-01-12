import React from "react";
import {
  Commodity,
  CommodityCounts,
  ResourceCard,
  ResourceCounts,
  RollType,
  Tile,
  Vertex,
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

const playerColors = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#f97316",
  "#9333ea",
  "#0891b2",
];

const tileSize = 96;
const vertexSize = 18;
const edgeWidth = 12;

const maxPieces = {
  settlements: 5,
  cities: 4,
  roads: 19,
};

const commodityMap: Record<ResourceCard, Commodity | undefined> = {
  wood: undefined,
  brick: undefined,
  sheep: "cloth",
  wheat: "paper",
  ore: "coin",
};

const adjustHexColor = (hex: string, amount: number) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;
  const num = parseInt(normalized, 16);
  const clamp = (value: number) => Math.min(255, Math.max(0, value));
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

function Main() {
  const game = store.gameW.game;
  const currentPlayer = utils.getCurrent(game);
  const myIndex = utils.myIndex(game);
  const me = myIndex >= 0 ? game.players[myIndex] : null;
  const [pendingAction, setPendingAction] = React.useState<null | {
    type: "settlement" | "city" | "road";
    label: string;
    cost: Partial<ResourceCounts>;
    target: number | [number, number];
  }>(null);

  const isSetupActive = game.setupPhase?.active ?? false;
  const setupStep = game.setupPhase?.step ?? "settlement";
  const canRoll = utils.isMyTurn(game) && !game.hasRolled && !isSetupActive;
  const canAct =
    utils.isMyTurn(game) &&
    (isSetupActive || (game.hasRolled && !game.pendingRobber));
  const canMoveRobber =
    utils.isMyTurn(game) &&
    !isSetupActive &&
    game.hasRolled &&
    !!game.pendingRobber;

  const totalResources = (resources: ResourceCounts) =>
    Object.values(resources).reduce((sum, value) => sum + value, 0);

  const totalCommodities = (commodities: CommodityCounts) =>
    Object.values(commodities).reduce((sum, value) => sum + value, 0);

  const totalCards = (player: typeof game.players[number] | null) =>
    player
      ? totalResources(player.resources) +
        (game.params.citiesAndKnights
          ? totalCommodities(player.commodities)
          : 0)
      : 0;

  const getPlayerColor = (playerIndex: number) =>
    playerColors[playerIndex % playerColors.length];

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

  const tilesWithVertices = game.tiles.filter((tile) => tile.vertices);

  const adjacencyMap = React.useMemo(() => {
    const map = new Map<number, Set<number>>();
    tilesWithVertices.forEach((tile) => {
      tile.vertices!.forEach((vertexId, index) => {
        const neighbors = new Set<number>();
        const prev =
          tile.vertices![
            (index - 1 + tile.vertices!.length) % tile.vertices!.length
          ];
        const next = tile.vertices![(index + 1) % tile.vertices!.length];
        neighbors.add(prev);
        neighbors.add(next);
        if (!map.has(vertexId)) map.set(vertexId, new Set());
        neighbors.forEach((neighbor) => map.get(vertexId)!.add(neighbor));
      });
    });
    return map;
  }, [tilesWithVertices]);

  const edgeList = React.useMemo(() => {
    const edgeMap = new Map<string, [number, number]>();
    tilesWithVertices.forEach((tile) => {
      const verts = tile.vertices!;
      verts.forEach((vertexId, index) => {
        const next = verts[(index + 1) % verts.length];
        const edge: [number, number] =
          vertexId < next ? [vertexId, next] : [next, vertexId];
        const key = edge.join("-");
        if (!edgeMap.has(key)) edgeMap.set(key, edge);
      });
    });
    return Array.from(edgeMap.values());
  }, [tilesWithVertices]);

  const vertices = game.vertices || [];

  const getVertex = (id: number) =>
    vertices.find((vertex) => vertex.id === id);

  const getTileCenter = (tile: Tile) => {
    const verts = tile.vertices || [];
    if (verts.length === 0) return { x: 0, y: 0 };
    const coords = verts
      .map((id) => getVertex(id))
      .filter((vertex): vertex is Vertex => !!vertex);
    const centerX =
      coords.reduce((sum, vertex) => sum + vertex.x, 0) / coords.length;
    const centerY =
      coords.reduce((sum, vertex) => sum + vertex.y, 0) / coords.length;
    return { x: centerX, y: centerY };
  };

  const vertexBounds = vertices.reduce(
    (bounds, vertex) => {
      bounds.minX = Math.min(bounds.minX, vertex.x);
      bounds.maxX = Math.max(bounds.maxX, vertex.x);
      bounds.minY = Math.min(bounds.minY, vertex.y);
      bounds.maxY = Math.max(bounds.maxY, vertex.y);
      return bounds;
    },
    {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    }
  );

  const padding = tileSize;
  const boardWidth =
    (vertexBounds.maxX - vertexBounds.minX) * tileSize + padding * 2 || 0;
  const boardHeight =
    (vertexBounds.maxY - vertexBounds.minY) * tileSize + padding * 2 || 0;

  const toBoardCoords = (x: number, y: number) => ({
    left: (x - vertexBounds.minX) * tileSize + padding,
    top: (y - vertexBounds.minY) * tileSize + padding,
  });

  const getPlayerEdges = (playerIndex: number) =>
    (game.roads || []).filter((road) => road.playerIndex === playerIndex);

  const hasAdjacentBuilding = (vertexId: number) =>
    vertices.some(
      (vertex) =>
        vertex.building && adjacencyMap.get(vertexId)?.has(vertex.id)
    );

  const hasAnyBuilding = (playerIndex: number) =>
    vertices.some((vertex) => vertex.building?.playerIndex === playerIndex);

  const isEdgeOccupied = (edge: [number, number]) =>
    (game.roads || []).some(
      (road) => road.edge[0] === edge[0] && road.edge[1] === edge[1]
    );

  const isEdgeConnectedToPlayer = (edge: [number, number], playerIndex: number) =>
    (game.roads || []).some(
      (road) =>
        road.playerIndex === playerIndex &&
        (road.edge.includes(edge[0]) || road.edge.includes(edge[1]))
    );

  const edgeTouchesPlayerBuilding = (
    edge: [number, number],
    playerIndex: number
  ) =>
    vertices.some(
      (vertex) =>
        edge.includes(vertex.id) && vertex.building?.playerIndex === playerIndex
    );

  const canPlaceRoad = (edge: [number, number]) => {
    if (!canAct || (isSetupActive && setupStep !== "road")) return false;
    if (isEdgeOccupied(edge)) return false;
    const playerIndex = game.currentPlayer;
    if (!hasAnyBuilding(playerIndex) && getPlayerEdges(playerIndex).length === 0)
      return true;
    return (
      isEdgeConnectedToPlayer(edge, playerIndex) ||
      edgeTouchesPlayerBuilding(edge, playerIndex)
    );
  };

  const canPlaceSettlement = (vertexId: number) => {
    if (!canAct || (isSetupActive && setupStep !== "settlement")) return false;
    const vertex = getVertex(vertexId);
    if (!vertex || vertex.building) return false;
    if (hasAdjacentBuilding(vertexId)) return false;
    if (isSetupActive) return true;
    if (!hasAnyBuilding(game.currentPlayer)) return true;
    return (game.roads || []).some(
      (road) =>
        road.playerIndex === game.currentPlayer &&
        road.edge.includes(vertexId)
    );
  };

  const canPlaceCity = (vertexId: number) => {
    if (!canAct || isSetupActive) return false;
    const vertex = getVertex(vertexId);
    if (!vertex?.building) return false;
    return (
      vertex.building.playerIndex === game.currentPlayer &&
      vertex.building.type === "settlement"
    );
  };

  const bankHasResource = (resource: ResourceCard, amount: number) => {
    if (!game.bank) return true;
    return game.bank.resources[resource] >= amount;
  };

  const bankHasCommodity = (commodity: Commodity, amount: number) => {
    if (!game.bank) return true;
    return game.bank.commodities[commodity] >= amount;
  };

  const grantResource = (playerIndex: number, resource: ResourceCard) => {
    if (!bankHasResource(resource, 1)) return false;
    game.players[playerIndex].resources[resource] += 1;
    if (game.bank) game.bank.resources[resource] -= 1;
    return true;
  };

  const grantCommodity = (playerIndex: number, commodity: Commodity) => {
    if (!bankHasCommodity(commodity, 1)) return false;
    game.players[playerIndex].commodities[commodity] += 1;
    if (game.bank) game.bank.commodities[commodity] -= 1;
    return true;
  };

  const discardRandomCard = (playerIndex: number, count: number) => {
    const player = game.players[playerIndex];
    const pool: Array<ResourceCard | Commodity> = [];
    Object.entries(player.resources).forEach(([resource, amount]) => {
      for (let i = 0; i < amount; i += 1) {
        pool.push(resource as ResourceCard);
      }
    });
    Object.entries(player.commodities).forEach(([commodity, amount]) => {
      for (let i = 0; i < amount; i += 1) {
        pool.push(commodity as Commodity);
      }
    });
    utils.shuffle(pool);
    const removed = pool.splice(0, count);
    removed.forEach((card) => {
      if (card === "cloth" || card === "coin" || card === "paper") {
        player.commodities[card] -= 1;
        if (game.bank) game.bank.commodities[card] += 1;
      } else {
        player.resources[card] -= 1;
        if (game.bank) game.bank.resources[card] += 1;
      }
    });
  };

  const stealFromPlayer = (playerIndex: number) => {
    const player = game.players[playerIndex];
    const pool: Array<ResourceCard | Commodity> = [];
    Object.entries(player.resources).forEach(([resource, amount]) => {
      for (let i = 0; i < amount; i += 1) {
        pool.push(resource as ResourceCard);
      }
    });
    Object.entries(player.commodities).forEach(([commodity, amount]) => {
      for (let i = 0; i < amount; i += 1) {
        pool.push(commodity as Commodity);
      }
    });
    if (pool.length === 0) return false;
    const stolen = utils.randomFrom(pool);
    if (stolen === "cloth" || stolen === "coin" || stolen === "paper") {
      player.commodities[stolen] -= 1;
      game.players[game.currentPlayer].commodities[stolen] += 1;
    } else {
      player.resources[stolen] -= 1;
      game.players[game.currentPlayer].resources[stolen] += 1;
    }
    return true;
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

    const gained: string[] = [];
    if (total === 7) {
      game.pendingRobber = true;
      game.players.forEach((player, index) => {
        const cardCount =
          totalResources(player.resources) + totalCommodities(player.commodities);
        if (cardCount > 7) {
          discardRandomCard(index, Math.floor(cardCount / 2));
        }
      });
    } else {
      game.tiles.forEach((tile, tileIndex) => {
        if (
          tile.number === total &&
          tile.resource !== "desert" &&
          tileIndex !== game.robberTileIndex
        ) {
          const resource = tile.resource as ResourceCard;
          const commodity = commodityMap[resource];
          (tile.vertices || []).forEach((vertexId) => {
            const vertex = getVertex(vertexId);
            if (!vertex?.building) return;
            const playerIndex = vertex.building.playerIndex;
            if (vertex.building.type === "settlement") {
              if (grantResource(playerIndex, resource)) {
                gained.push(
                  `${game.players[playerIndex].userName} gained ${resource}`
                );
              }
            } else if (vertex.building.type === "city") {
              if (game.params.citiesAndKnights && commodity) {
                const resourceGranted = grantResource(playerIndex, resource);
                const commodityGranted = grantCommodity(playerIndex, commodity);
                if (resourceGranted || commodityGranted) {
                  gained.push(
                    `${game.players[playerIndex].userName} gained ${resource}${
                      commodityGranted ? ` and ${commodity}` : ""
                    }`
                  );
                }
              } else {
                const grantedOne = grantResource(playerIndex, resource);
                const grantedTwo = grantResource(playerIndex, resource);
                if (grantedOne || grantedTwo) {
                  gained.push(
                    `${game.players[playerIndex].userName} gained ${resource}`
                  );
                }
              }
            }
          });
        }
      });
    }

    const gainSummary =
      total === 7
        ? "and triggered a 7 (move the robber)"
        : gained.length > 0
        ? `and ${gained.join(", ")}`
        : "and found no matching tiles";

    store.update(
      `rolled ${total} (${die1} + ${die2}) ${gainSummary}`.trim()
    );
  };

  const endTurn = () => {
    if (!canAct || isSetupActive) return;
    utils.incrementPlayerTurn(game);
    game.hasRolled = false;
    game.pendingRobber = false;
    setPendingAction(null);
    store.update("ended their turn");
  };

  const buyDevCard = () => {
    if (!canAct || isSetupActive) return;
    const cost = { sheep: 1, wheat: 1, ore: 1 };
    if (!canAfford(cost)) return;
    applyCost(cost);
    game.players[game.currentPlayer].devCards += 1;
    store.update("bought a development card");
  };

  const playDevCard = () => {
    if (!canAct || isSetupActive) return;
    const player = game.players[game.currentPlayer];
    if (player.devCards < 1) return;
    player.devCards -= 1;
    store.update("played a development card");
  };

  const assignPorts = (vertexId: number) => {
    const ports = game.ports || [];
    const player = game.players[game.currentPlayer];
    ports.forEach((port) => {
      if (port.edge.includes(vertexId)) {
        if (!player.ports.includes(port.type)) {
          player.ports.push(port.type);
        }
      }
    });
  };

  const finalizeSetupStep = () => {
    if (!game.setupPhase) return;
    game.setupPhase.index += 1;
    if (game.setupPhase.index >= game.setupPhase.order.length) {
      game.setupPhase.active = false;
      game.currentPlayer = game.setupPhase.order[0] ?? 0;
      game.setupPhase.step = "settlement";
    } else {
      game.currentPlayer = game.setupPhase.order[game.setupPhase.index];
      game.setupPhase.step = "settlement";
    }
  };

  const placeSettlement = (vertexId: number) => {
    const player = game.players[game.currentPlayer];
    const cost = { brick: 1, wood: 1, sheep: 1, wheat: 1 };
    if (!isSetupActive && !canAfford(cost)) return;
    if (!canPlaceSettlement(vertexId)) return;
    if (!isSetupActive) applyCost(cost);
    const vertex = getVertex(vertexId);
    if (!vertex) return;
    vertex.building = { playerIndex: game.currentPlayer, type: "settlement" };
    player.settlements += 1;
    player.victoryPoints += 1;
    assignPorts(vertexId);
    const gainedResources: ResourceCard[] = [];
    if (isSetupActive && player.settlements === 2) {
      game.tiles.forEach((tile) => {
        if (tile.resource !== "desert" && tile.vertices?.includes(vertexId)) {
          const resource = tile.resource as ResourceCard;
          if (grantResource(game.currentPlayer, resource)) {
            gainedResources.push(resource);
          }
        }
      });
    }
    if (isSetupActive && game.setupPhase) {
      game.setupPhase.step = "road";
    }
    store.update(
      gainedResources.length > 0
        ? `built a settlement and gained ${gainedResources.join(", ")}`
        : "built a settlement"
    );
  };

  const placeCity = (vertexId: number) => {
    const player = game.players[game.currentPlayer];
    const cost = { ore: 3, wheat: 2 };
    if (!canAfford(cost)) return;
    if (!canPlaceCity(vertexId)) return;
    applyCost(cost);
    const vertex = getVertex(vertexId);
    if (!vertex?.building) return;
    vertex.building.type = "city";
    player.settlements -= 1;
    player.cities += 1;
    player.victoryPoints += 1;
    store.update("upgraded to a city");
  };

  const placeRoad = (edge: [number, number]) => {
    const cost = { brick: 1, wood: 1 };
    if (!isSetupActive && !canAfford(cost)) return;
    if (!canPlaceRoad(edge)) return;
    if (!isSetupActive) applyCost(cost);
    if (!game.roads) game.roads = [];
    game.roads.push({ playerIndex: game.currentPlayer, edge });
    game.players[game.currentPlayer].roads += 1;
    if (isSetupActive) {
      finalizeSetupStep();
    }
    store.update("built a road");
  };

  const handleVertexClick = (vertexId: number) => {
    const settlementCost = { brick: 1, wood: 1, sheep: 1, wheat: 1 };
    const cityCost = { ore: 3, wheat: 2 };
    const canAffordSettlement = isSetupActive || canAfford(settlementCost);
    const canAffordCity = canAfford(cityCost);

    if (canPlaceCity(vertexId) && canAffordCity) {
      setPendingAction({
        type: "city",
        label: "Upgrade to a city",
        cost: cityCost,
        target: vertexId,
      });
      return;
    }

    if (canPlaceSettlement(vertexId) && canAffordSettlement) {
      setPendingAction({
        type: "settlement",
        label: "Build a settlement",
        cost: settlementCost,
        target: vertexId,
      });
    }
  };

  const handleEdgeClick = (edge: [number, number]) => {
    const cost = { brick: 1, wood: 1 };
    const canAffordRoad = isSetupActive || canAfford(cost);
    if (!canPlaceRoad(edge) || !canAffordRoad) return;
    setPendingAction({
      type: "road",
      label: "Build a road",
      cost,
      target: edge,
    });
  };

  const confirmPlacement = () => {
    if (!pendingAction) return;
    if (pendingAction.type === "settlement") {
      placeSettlement(pendingAction.target as number);
    } else if (pendingAction.type === "city") {
      placeCity(pendingAction.target as number);
    } else {
      placeRoad(pendingAction.target as [number, number]);
    }
    setPendingAction(null);
  };

  const handleRobberMove = (tileIndex: number) => {
    if (!canMoveRobber) return;
    game.robberTileIndex = tileIndex;
    game.pendingRobber = false;
    setPendingAction(null);
    const tile = game.tiles[tileIndex];
    const opponents = new Set<number>();
    (tile.vertices || []).forEach((vertexId) => {
      const vertex = getVertex(vertexId);
      if (
        vertex?.building &&
        vertex.building.playerIndex !== game.currentPlayer
      ) {
        opponents.add(vertex.building.playerIndex);
      }
    });
    const opponentList = Array.from(opponents);
    if (opponentList.length > 0) {
      const targetIndex = utils.randomFrom(opponentList);
      const stolen = stealFromPlayer(targetIndex);
      store.update(
        stolen
          ? `moved the robber and stole a card from ${
              game.players[targetIndex].userName
            }`
          : "moved the robber"
      );
    } else {
      store.update("moved the robber");
    }
  };

  const devCardCost = { sheep: 1, wheat: 1, ore: 1 };

  const setupMessage =
    isSetupActive && setupStep === "road"
      ? "Setup: place a road"
      : isSetupActive
      ? "Setup: place a settlement"
      : null;
  const pendingAffordable = pendingAction
    ? isSetupActive || canAfford(pendingAction.cost)
    : true;

  const playerCount = game.players.length;
  const baseOrder = utils.count(playerCount);
  const startIndex =
    myIndex >= 0
      ? myIndex
      : game.setupPhase?.order[0] !== undefined
      ? game.setupPhase.order[0]
      : 0;
  const orderedIndices = baseOrder
    .slice(startIndex)
    .concat(baseOrder.slice(0, startIndex));

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
          <strong>{me ? `${totalCards(me)} cards` : "Spectating"}</strong>
        </div>
        {setupMessage && <div className={css.alert}>{setupMessage}</div>}
        {game.pendingRobber && (
          <div className={css.alert}>Move the robber</div>
        )}
      </div>
      <div className={css.actions}>
        <button onClick={rollDice} disabled={!canRoll}>
          Roll dice
        </button>
        <button
          onClick={buyDevCard}
          disabled={!canAct || isSetupActive || !canAfford(devCardCost)}
        >
          Buy dev card (sheep, wheat, ore)
        </button>
        <button
          onClick={playDevCard}
          disabled={
            !canAct ||
            isSetupActive ||
            game.players[game.currentPlayer].devCards < 1
          }
        >
          Play dev card
        </button>
        <button onClick={endTurn} disabled={!canAct || isSetupActive}>
          End turn
        </button>
      </div>
      <div className={css.players}>
        {orderedIndices.map((index) => {
          const player = game.players[index];
          const color = getPlayerColor(index);
          return (
            <React.Fragment key={player.userId}>
              <div
                className={[
                  css.playerCard,
                  index === game.currentPlayer ? css.activePlayer : "",
                ].join(" ")}
                style={{ ["--player-color" as string]: color } as React.CSSProperties}
              >
                <div className={css.playerHeader}>
                  <strong>{player.userName}</strong>
                  {index === utils.myIndex(game) && (
                    <span className={css.playerBadge}>You</span>
                  )}
                </div>
                <div className={css.playerStats}>
                  <span>{player.victoryPoints} VP</span>
                  <span>
                    {player.settlements}/{maxPieces.settlements} settlements
                  </span>
                  <span>
                    {player.cities}/{maxPieces.cities} cities
                  </span>
                  <span>
                    {player.roads}/{maxPieces.roads} roads
                  </span>
                  <span>{player.devCards} dev cards</span>
                </div>
                {player.ports.length > 0 && (
                  <div className={css.portList}>
                    Ports:{" "}
                    {player.ports
                      .map((port) =>
                        port === "generic" ? "3:1" : `${port} 2:1`
                      )
                      .join(", ")}
                  </div>
                )}
                <div className={css.resourceGrid}>
                  {Object.entries(player.resources).map(
                    ([resource, amount]) => (
                      <div key={resource} className={css.resourceItem}>
                        <span className={css.resourceLabel}>{resource}</span>
                        <span className={css.resourceCount}>{amount}</span>
                      </div>
                    )
                  )}
                  {game.params.citiesAndKnights &&
                    Object.entries(player.commodities).map(
                      ([commodity, amount]) => (
                        <div key={commodity} className={css.resourceItem}>
                          <span className={css.resourceLabel}>{commodity}</span>
                          <span className={css.resourceCount}>{amount}</span>
                        </div>
                      )
                    )}
                </div>
              </div>
              {myIndex >= 0 && index === myIndex && (
                <div className={css.playerDivider} aria-hidden="true">
                  |
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className={css.board}>
        <div
          className={css.boardSurface}
          style={{ width: boardWidth, height: boardHeight }}
        >
          {game.tiles.map((tile, index) => {
            const center = getTileCenter(tile);
            const coords = toBoardCoords(center.x, center.y);
            const isRobber = game.robberTileIndex === index;
            return (
              <button
                key={`tile-${index}`}
                type="button"
                onClick={() => handleRobberMove(index)}
                aria-label={`tile-${index}`}
                disabled={!canMoveRobber}
                className={[css.tile, isRobber ? css.robberTile : ""].join(" ")}
                style={{
                  backgroundColor: resourceColors[tile.resource],
                  left: coords.left - tileSize / 2,
                  top: coords.top - tileSize / 2,
                }}
              >
                <div className={css.tileResource}>{tile.resource}</div>
                {tile.number !== undefined && (
                  <div className={css.tileNumber}>{tile.number}</div>
                )}
                {isRobber && <div className={css.robber}>Robber</div>}
              </button>
            );
          })}
          {edgeList.map((edge) => {
            const v1 = getVertex(edge[0]);
            const v2 = getVertex(edge[1]);
            if (!v1 || !v2) return null;
            const start = toBoardCoords(v1.x, v1.y);
            const end = toBoardCoords(v2.x, v2.y);
            const midX = (start.left + end.left) / 2;
            const midY = (start.top + end.top) / 2;
            const length = Math.hypot(end.left - start.left, end.top - start.top);
            const angle =
              (Math.atan2(end.top - start.top, end.left - start.left) * 180) /
              Math.PI;
            const isOwned = (game.roads || []).some(
              (road) => road.edge[0] === edge[0] && road.edge[1] === edge[1]
            );
            const roadOwner = (game.roads || []).find(
              (road) => road.edge[0] === edge[0] && road.edge[1] === edge[1]
            )?.playerIndex;
            return (
              <button
                key={`edge-${edge[0]}-${edge[1]}`}
                type="button"
                onClick={() => handleEdgeClick(edge)}
                aria-label={`edge-${edge[0]}-${edge[1]}`}
                className={css.edge}
                style={{
                  left: midX - length / 2,
                  top: midY - edgeWidth / 2,
                  width: length,
                  transform: `rotate(${angle}deg)`,
                  backgroundColor: isOwned
                    ? getPlayerColor(roadOwner ?? 0)
                    : undefined,
                  opacity: isOwned ? 1 : 0.45,
                }}
                disabled={
                  !canPlaceRoad(edge) ||
                  (!isSetupActive && !canAfford({ brick: 1, wood: 1 }))
                }
              />
            );
          })}
          {(game.ports || []).map((port, index) => {
            const v1 = getVertex(port.edge[0]);
            const v2 = getVertex(port.edge[1]);
            if (!v1 || !v2) return null;
            const start = toBoardCoords(v1.x, v1.y);
            const end = toBoardCoords(v2.x, v2.y);
            const midX = (start.left + end.left) / 2;
            const midY = (start.top + end.top) / 2;
            return (
              <div
                key={`port-${index}`}
                className={css.portMarker}
                style={{ left: midX, top: midY }}
              >
                <span className={css.portLabel}>
                  {port.type === "generic" ? "3:1" : `${port.type} 2:1`}
                </span>
              </div>
            );
          })}
          {vertices.map((vertex) => {
            const coords = toBoardCoords(vertex.x, vertex.y);
            const isSettlement = vertex.building?.type === "settlement";
            const isCity = vertex.building?.type === "city";
            const owner =
              vertex.building?.playerIndex !== undefined
                ? game.players[vertex.building.playerIndex]
                : null;
            const ownerColor =
              vertex.building?.playerIndex !== undefined
                ? getPlayerColor(vertex.building.playerIndex)
                : null;
            return (
              <button
                key={`vertex-${vertex.id}`}
                type="button"
                onClick={() => handleVertexClick(vertex.id)}
                aria-label={`vertex-${vertex.id}`}
                className={css.vertex}
                style={{
                  left: coords.left - vertexSize / 2,
                  top: coords.top - vertexSize / 2,
                  backgroundColor: isCity
                    ? ownerColor
                      ? adjustHexColor(ownerColor, -30)
                      : "#1f2937"
                    : isSettlement
                    ? ownerColor || "#f59e0b"
                    : "#f9fafb",
                  borderColor: ownerColor || "#cbd5f5",
                }}
                disabled={
                  (!canPlaceSettlement(vertex.id) ||
                    (!isSetupActive &&
                      !canAfford({
                        brick: 1,
                        wood: 1,
                        sheep: 1,
                        wheat: 1,
                      }))) &&
                  (!canPlaceCity(vertex.id) ||
                    !canAfford({ ore: 3, wheat: 2 }))
                }
                title={
                  owner
                    ? `${owner.userName} ${vertex.building?.type}`
                    : "Empty vertex"
                }
              />
            );
          })}
        </div>
      </div>
      {pendingAction && (
        <div className={css.confirmOverlay} role="dialog" aria-modal="true">
          <div className={css.confirmCard}>
            <h3>{pendingAction.label}</h3>
            <p>Are you sure you want to continue?</p>
            <div className={css.confirmActions}>
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className={css.secondaryButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPlacement}
                disabled={!pendingAffordable}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Main;
