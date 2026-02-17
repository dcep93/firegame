import { firebaseData } from "./FirebaseWrapper";
import { sendCornerHighlights30, sendEdgeHighlights31 } from "./gameLogic";
import {
  GameStateUpdateType,
  PlayerActionState,
  State,
} from "./gameLogic/CatannFilesEnums";
import { isMyTurn } from "./gameLogic/createNew";
import { sendToMainSocket } from "./handleMessage";

const cascadeServerMessage = (
  data: any,
  sendResponse: typeof sendToMainSocket,
) => {
  const isGameStateUpdate = [
    GameStateUpdateType.BuildGame,
    GameStateUpdateType.GameStateUpdated,
  ].includes(data.data.type);
  if (isGameStateUpdate) {
    const resourcesToGive = firebaseData.__meta.change.resourcesToGive;
    if (resourcesToGive) {
      sendToMainSocket?.({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.GivePlayerResourcesFromTile,
          payload: resourcesToGive,
        },
      });
    }
    sendResponse(data);
    if (
      data.data.type === GameStateUpdateType.BuildGame &&
      data.data.payload.gameSettings.karmaActive
    ) {
      sendToMainSocket({
        id: State.GameStateUpdate.toString(),
        data: {
          type: GameStateUpdateType.KarmaState,
          payload: true,
        },
      });
    }
    if (isMyTurn()) {
      if (
        [
          PlayerActionState.InitialPlacementPlaceSettlement,
          PlayerActionState.InitialPlacementPlaceCity,
          PlayerActionState.PlaceSettlement,
          PlayerActionState.PlaceCity,
          PlayerActionState.PlaceCityWithDiscount,
        ].includes(data.data.payload.gameState?.currentState.actionState)
      )
        sendCornerHighlights30(firebaseData.GAME);
      if (
        [
          PlayerActionState.PlaceRoad,
          PlayerActionState.InitialPlacementRoadPlacement,
          PlayerActionState.PlaceRoadForFree,
          PlayerActionState.Place2MoreRoadBuilding,
          PlayerActionState.Place1MoreRoadBuilding,
        ].includes(data.data.payload.gameState?.currentState.actionState)
      )
        sendEdgeHighlights31(firebaseData.GAME);
    }
  } else {
    sendResponse(data);
  }
};

export default cascadeServerMessage;
