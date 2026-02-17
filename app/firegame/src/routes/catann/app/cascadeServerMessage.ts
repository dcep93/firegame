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
  const sendHighlights = () => {
    const actionState =
      firebaseData.GAME!.data.payload.gameState.currentState.actionState;
    console.log("test.log.sendHighlights", isMyTurn(), actionState);
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
        sendCornerHighlights30(firebaseData.GAME);
      if (
        [
          PlayerActionState.PlaceRoad,
          PlayerActionState.InitialPlacementRoadPlacement,
          PlayerActionState.PlaceRoadForFree,
          PlayerActionState.Place2MoreRoadBuilding,
          PlayerActionState.Place1MoreRoadBuilding,
        ].includes(actionState)
      )
        sendEdgeHighlights31(firebaseData.GAME);
    }
  };
  if (data.data.type === GameStateUpdateType.GameStateUpdated) {
    sendHighlights();
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
