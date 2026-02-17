import { firebaseData } from "./FirebaseWrapper";
import { sendCornerHighlights30 } from "./gameLogic";
import { GameStateUpdateType, State } from "./gameLogic/CatannFilesEnums";
import { isMyTurn } from "./gameLogic/createNew";
import { sendToMainSocket } from "./handleMessage";

const cascadeServerMessage = (data: any) => {
  const isGameStateUpdate = [
    GameStateUpdateType.BuildGame,
    GameStateUpdateType.GameStateUpdated,
  ].includes(data.data.type);
  if (isGameStateUpdate) {
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
      sendCornerHighlights30(firebaseData.GAME);
    }
  }
};

export default cascadeServerMessage;
