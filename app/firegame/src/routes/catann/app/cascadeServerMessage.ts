import { firebaseData } from "./FirebaseWrapper";
import {
  GameState,
  getCardDiscardLimit,
  getPlayerStateByColor,
  getRobberEligibleTiles,
  ResourcesToGiveType,
  sendCornerHighlights30,
  sendEdgeHighlights31,
  sendResetTradeStateAtEndOfTurn80,
  sendTileHighlights33,
} from "./gameLogic";
import {
  CardEnum,
  GameLogMessageType,
  GameStateUpdateType,
  PlayerActionState,
  State,
} from "./gameLogic/CatannFilesEnums";
import { isMyTurn, newGame } from "./gameLogic/createNew";
import { sendToMainSocket } from "./handleMessage";
import { isTest } from "./IframeScriptString";

const cascadeServerMessage = (
  data: ReturnType<typeof newGame>,
  sendResponse: typeof sendToMainSocket,
) => {
  const gameData = firebaseData.GAME;
  if (!gameData) return;
  const gameState = gameData.data.payload.gameState;

  const sendHighlights = () => {
    if (firebaseData.__meta?.change.action === "passTurn") {
      sendResetTradeStateAtEndOfTurn80();
    }
    const actionState =
      gameData.data.payload.gameState.currentState.actionState;
    if (isMyTurn()) {
      if (
        [
          PlayerActionState.InitialPlacementPlaceSettlement,
          PlayerActionState.InitialPlacementPlaceCity,
          PlayerActionState.PlaceSettlement,
          PlayerActionState.PlaceCity,
          PlayerActionState.PlaceCityWithDiscount,
        ].includes(actionState)
      )
        sendCornerHighlights30(gameData);
      if (
        [
          PlayerActionState.InitialPlacementRoadPlacement,
          PlayerActionState.PlaceRoadForFree,
          PlayerActionState.Place1MoreRoadBuilding,
          PlayerActionState.Place2MoreRoadBuilding,
        ].includes(actionState)
      ) {
        sendEdgeHighlights31(gameData);
      }
      if ([PlayerActionState.PlaceRobberOrPirate].includes(actionState)) {
        const robberHighlightTiles = getRobberEligibleTiles(gameData);
        sendTileHighlights33(gameData, robberHighlightTiles);
      }
    }
  };
  if (data.data.type === GameStateUpdateType.GameStateUpdated) {
    sendHighlights();
    if (!isMyTurn()) {
      const latest = Object.entries(
        gameData.data.payload.gameState.gameLogState,
      )
        .map(([key, val]) => ({ key: parseInt(key), val }))
        .sort((a, b) => b.key - a.key)[0].val;
      if (latest.text.type === GameLogMessageType.RolledDice) {
        if (
          gameData.data.payload.gameState.currentState.actionState ===
          PlayerActionState.SelectCardsToDiscard
        ) {
          [
            GameStateUpdateType.HighlightCorners,
            GameStateUpdateType.HighlightTiles,
            GameStateUpdateType.HighlightRoadEdges,
            GameStateUpdateType.HighlightShipEdges,
          ].forEach((type) =>
            sendToMainSocket?.({
              id: State.GameStateUpdate.toString(),
              data: {
                type,
                payload: [],
              },
            }),
          );
          // sendToMainSocket?.({
          //   id: State.GameStateUpdate.toString(),
          //   data: {
          //     type: GameStateUpdateType.DiscardBroadcast,
          //     payload: null,
          //   },
          // });
        }
      }
      const exchangeCardsPayloads =
        firebaseData.__meta.change.exchangeCardsPayloads;
      if (exchangeCardsPayloads) {
        exchangeCardsPayloads
          .filter(
            (exchangeCardsPayload: any) =>
              exchangeCardsPayload.givingPlayer !==
              gameData.data.payload.playerColor,
          )
          .forEach((exchangeCardsPayload: any) =>
            sendToMainSocket?.({
              id: State.GameStateUpdate.toString(),
              data: {
                type: GameStateUpdateType.ExchangeCards,
                payload: {
                  ...exchangeCardsPayload,
                  givingCards:
                    exchangeCardsPayload.givingPlayer === 0
                      ? exchangeCardsPayload.givingCards.map(
                          () => CardEnum.DevelopmentBack,
                        )
                      : exchangeCardsPayload.givingCards,
                },
              },
            }),
          );
      }
    }
    if (firebaseData.__meta.change.action === "ExecuteTrade") {
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.TradeFinalized,
          payload: {},
        },
      });
    }
    const resourcesToGive: ResourcesToGiveType =
      firebaseData.__meta.change.resourcesToGive;
    if (resourcesToGive) {
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.GivePlayerResourcesFromTile,
          payload: resourcesToGive.sort((a, b) => a.tileIndex - b.tileIndex),
        },
      });
    }

    const latest = Object.entries(gameData.data.payload.gameState.gameLogState)
      .map(([key, val]) => ({ key: parseInt(key), val }))
      .sort((a, b) => b.key - a.key)[0].val;
    if (latest.text.type === GameLogMessageType.RolledDice) {
      if (
        gameData.data.payload.gameState.currentState.actionState ===
        PlayerActionState.SelectCardsToDiscard
      ) {
        const playerColor = gameData.data.payload.playerColor;
        const playerCards = [
          ...(getPlayerStateByColor(gameState, playerColor)?.resourceCards
            ?.cards ?? []),
        ].sort((a, b) => a - b);
        const cardDiscardLimit = getCardDiscardLimit(gameData);
        const amountToDiscard =
          playerCards.length > cardDiscardLimit
            ? Math.floor(playerCards.length / 2)
            : 0;
        if (amountToDiscard > 0) {
          sendToMainSocket?.({
            id: State.GameStateUpdate.toString(),
            data: {
              type: GameStateUpdateType.AmountOfCardsToDiscard,
              payload: {
                title: { key: "strings:game.prompts.discardCards" },
                body: {
                  key: "strings:game.prompts.youHaveMoreThanXCards",
                  options: {
                    count: cardDiscardLimit,
                    amountToDiscard,
                  },
                },
                selectCardFormat: {
                  amountOfCardsToSelect: amountToDiscard,
                  validCardsToSelect: playerCards,
                  allowableActionState: PlayerActionState.SelectCardsToDiscard,
                  showCardBadge: true,
                  cancelButtonActive: false,
                },
                showCondensedCardInformation: false,
              },
            },
          });
        }
      }
    }
    sendResponse(data);
  } else {
    // TODO does not need to be separate block
    sendResponse(data);
  }
  if (data.data.type === GameStateUpdateType.BuildGame) {
    if (data.data.payload.gameSettings.karmaActive) {
      sendToMainSocket({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.KarmaState,
          payload: true,
        },
      });
    }
    sendHighlights();
  }
};

export default cascadeServerMessage;

export const handleSpectator = (gameState: GameState) => {
  if (!isTest) return;
  const myColor = firebaseData.GAME!.data?.payload?.playerColor.toString();
  Object.entries(gameState?.playerStates || {}).forEach(
    ([playerColor, playerState]) => {
      if (playerColor === myColor) return;
      if (playerState?.resourceCards?.cards)
        playerState.resourceCards.cards = playerState?.resourceCards?.cards.map(
          () => CardEnum.ResourceBack,
        );
    },
  );
  Object.entries(
    gameState.mechanicDevelopmentCardsState?.players || {},
  ).forEach(([playerColor, playerState]) => {
    if (playerColor === myColor) return;
    if (playerState.developmentCardsBoughtThisTurn)
      delete playerState.developmentCardsBoughtThisTurn;
    if (playerState.developmentCards)
      playerState.developmentCards.cards =
        playerState.developmentCards.cards!.map(() => CardEnum.DevelopmentBack);
  });

  Object.entries(gameState.gameLogState || {}).forEach(([key, entry]) => {
    if (
      entry.toSpectators === false &&
      !entry.specificRecipients?.includes(parseInt(myColor))
    ) {
      delete gameState.gameLogState[key];
    }
  });
};
