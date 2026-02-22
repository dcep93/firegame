import { firebaseData } from "./FirebaseWrapper";
import {
  GameState,
  ResourcesToGiveType,
  sendCornerHighlights30,
  sendEdgeHighlights31,
  sendResetTradeStateAtEndOfTurn80,
} from "./gameLogic";
import {
  CardEnum,
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
          PlayerActionState.Place2MoreRoadBuilding,
          PlayerActionState.Place1MoreRoadBuilding,
        ].includes(actionState)
      ) {
        sendEdgeHighlights31(gameData);
      }
    }
  };
  if (data.data.type === GameStateUpdateType.GameStateUpdated) {
    sendHighlights();
    if (!isMyTurn()) {
      const exchangeCardsPayloads =
        firebaseData.__meta.change.exchangeCardsPayloads;
      if (exchangeCardsPayloads) {
        exchangeCardsPayloads.forEach((exchangeCardsPayload: any) =>
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
  const playerStates = gameState?.playerStates;
  if (!playerStates) return;
  Object.entries(playerStates).forEach(([playerColor, playerState]) => {
    if (playerColor === myColor) return;
    playerState.resourceCards = {
      cards: playerState?.resourceCards?.cards.map(() => CardEnum.ResourceBack),
    };
  });
};
