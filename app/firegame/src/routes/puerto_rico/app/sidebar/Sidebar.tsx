import { firebaseUndo } from "../../../../firegame/firebase";
import writer from "../../../../firegame/writer/writer";
import { PlayerTimer } from "../../../../shared/components/sidebar/Player";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import { history } from "../../../../shared/components/sidebar/SharedLog";
import { GameWrapperType } from "../../../../shared/store";
import css from "../index.module.css";
import { playerBoardElementId } from "../main/PlayerBoard";
import { getThemeKey, PuertoRicoThemeKey, setPreGameThemeKey, THEME_OPTIONS, theme } from "../theme/base";
import NewGame, { GameType, Params, PlayerType, playerLobbyEntries } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

type LobbyRow = {
  userId: string;
  userName: string;
  player?: PlayerType;
  connected: boolean;
};

class Sidebar extends SharedSidebar<{ onPreGameThemeChange?: () => void }> {
  name = theme.gameName;
  NewGame = NewGame;
  utils = utils;
  rules = theme.rulesUrl;
  state = { history };

  getParams(): Params {
    return { lobby: store.lobby, themeKey: getThemeKey() };
  }

  render() {
    const game = store.gameW.game;
    return (
      <aside className={css.sidebarPanel}>
        <section className={`${css.sidebarCard} ${css.brandCard}`}>
          <div className={css.sidebarStatusStack}>
            <select
              className={css.themeSelect}
              value={getThemeKey()}
              onChange={(event) => this.changeTheme(event.target.value as PuertoRicoThemeKey)}
              aria-label="Theme"
            >
              {THEME_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            {game && (
              <>
              <strong className={css.sidebarPhaseName}>{theme.phase[game.phase]}</strong>
              {game.activeRole && (
                <span className={css.sidebarActiveRole}>
                  {theme.labels.roles}: <strong>{theme.roles[game.activeRole]}</strong>
                </span>
              )}
              <button
                type="button"
                className={`${css.sidebarPlayerButton} ${
                  game.autoPlayerIds?.[game.players[game.currentPlayer]?.userId] ? css.autoPlayerButton : ""
                }`}
                onClick={() => utils.markAutoPlayer(game.currentPlayer)}
              >
                {game.players[game.currentPlayer]?.userName}
              </button>
              <span>{theme.labels.round} {game.round}</span>
              </>
            )}
          </div>
        </section>

        <section className={css.sidebarCard}>
          <div className={css.sidebarHeadingRow}>
            <h2>{theme.labels.controls}</h2>
            <a className={css.inlineSidebarButton} href={this.rules}>
              {theme.labels.rules}
            </a>
          </div>
          <div className={css.controlGrid}>
            <button onClick={this.startNewGame.bind(this)}>{theme.controls.newGame}</button>
            <button
              onClick={() => utils.skipAction()}
              disabled={!game || !utils.canPass()}
            >
              {theme.controls.pass}
            </button>
            <button onClick={() => firebaseUndo()}>{theme.labels.undo}</button>
            <a className={css.sidebarButton} href="..">
              {theme.labels.home}
            </a>
          </div>
          {game?.endTriggered && game.phase !== "game_over" && (
            <div className={css.sidebarAlert}>{game.endTriggered}</div>
          )}
        </section>

        <section className={css.sidebarCard}>
          <div className={css.sidebarHeadingRow}>
            <h2>{theme.labels.lobby}</h2>
            <button
              className={css.inlineSidebarButton}
              onClick={() => writer.leaveLobby()}
              disabled={store.isSpectator || !store.lobby[store.me.userId]}
            >
              {theme.labels.leave}
            </button>
          </div>
          <div className={css.lobbyList}>
            {this.lobbyRows(game).map(({ userId, userName, player, connected }) => {
              const isActing =
                player &&
                (game?.phase === "mayor"
                  ? game.actionQueue.includes(player.index)
                  : player.index === game?.currentPlayer);
              const isStationPicker = player && game?.phase === "role" && player.index === game.rolePicker;
              const isRoleOwner = player && game?.phase !== "role" && player.index === game?.roleOwner;
              const isAutoPlayer = player && !!game?.autoPlayerIds?.[player.userId];
              const content = (
                <>
                  {player ? (
                    <>
                      <span className={css.lobbyTime}>
                        <PlayerTimer userId={userId} />
                      </span>
                      <span className={css.lobbyMetric}>${player.doubloons}</span>
                      <span className={css.lobbyMetric}>{utils.scorePlayer(player).total} {theme.labels.vp}</span>
                      <span className={css.lobbyPlayerName}>{player.userName || userName}</span>
                    </>
                  ) : (
                    <span className={css.lobbyPlayerName}>{userName}</span>
                  )}
                </>
              );
              const className = `${css.lobbyRow} ${player ? css.clickableLobbyRow : ""} ${
                isActing ? css.currentLobbyRow : ""
              } ${
                isStationPicker ? css.stationPickerLobbyRow : ""
              } ${
                isRoleOwner ? css.roleOwnerLobbyRow : ""
              } ${
                isAutoPlayer ? css.autoLobbyRow : ""
              } ${connected ? "" : css.disconnectedLobbyRow}`;
              if (player) {
                return (
                  <button
                    key={userId}
                    type="button"
                    className={className}
                    onClick={() => this.scrollToPlayer(player)}
                  >
                    {content}
                  </button>
                );
              }
              return (
                <div
                  key={userId}
                  className={className}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section className={`${css.sidebarCard} ${css.logCard}`}>
          <div className={css.sidebarHeadingRow}>
            <h2>{theme.labels.log}</h2>
          </div>
          <div className={css.logList}>
            {this.state.history.map((wrapper, index) => {
              const depth = this.logDepth(wrapper, index);
              return (
                <button
                  key={index}
                  className={`${css.logEntry} ${depth === 1 ? css.logDepthOne : ""} ${
                    depth === 2 ? css.logDepthTwo : ""
                  }`}
                  onClick={() => this.revert(wrapper)}
                >
                  <span className={css.logId}>#{wrapper.info.id}</span>
                  <span className={css.logMessage}>{wrapper.info.message}</span>
                  <span className={css.logMeta}>
                    {new Date(wrapper.info.timestamp).toLocaleTimeString()}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </aside>
    );
  }

  lobbyRows(game: GameType | null): LobbyRow[] {
    const lobbyNames = new Map(playerLobbyEntries(store.lobby));
    const players = game?.players || [];
    const firstPlayer = game?.governor ?? 0;
    const gameRows = (game?.players || [])
      .slice()
      .sort((a, b) => playerOrder(a, firstPlayer, players.length) - playerOrder(b, firstPlayer, players.length))
      .map((player) => ({
        userId: player.userId,
        userName: lobbyNames.get(player.userId) || player.userName,
        player,
        connected: lobbyNames.has(player.userId),
      }));
    const gamePlayerIds = new Set(gameRows.map((row) => row.userId));
    const lobbyOnlyRows = playerLobbyEntries(store.lobby)
      .filter(([userId]) => !gamePlayerIds.has(userId))
      .map(([userId, userName]) => ({
        userId,
        userName,
        player: undefined,
        connected: true,
      }));
    return [...gameRows, ...lobbyOnlyRows];
  }

  scrollToPlayer(player: PlayerType): void {
    const element = document.getElementById(playerBoardElementId(player.userId));
    element?.scrollIntoView({ block: "start" });
  }

  logDepth(wrapper: GameWrapperType<GameType>, index: number): 0 | 1 | 2 {
    const previous = this.state.history[index + 1] as GameWrapperType<GameType> | undefined;
    if (previous?.game?.phase === "role" && !!wrapper.game?.activeRole) return 1;
    if (wrapper.game?.activeRole || previous?.game?.activeRole) return 2;
    return 0;
  }

  componentDidMount() {
    super.componentDidMount();
    this.updateHistory();
  }

  componentDidUpdate() {
    super.componentDidUpdate();
    this.updateHistory();
  }

  updateHistory() {
    const newState = store.gameW;
    if (!newState) return;
    if (!this.state.history[0] || newState.info.id !== this.state.history[0].info.id) {
      this.state.history.unshift(JSON.parse(JSON.stringify(newState)));
      const alertMessage = newState.info.alert;
      delete newState.info.alert;
      if (alertMessage) alert(alertMessage);
      this.setState({});
    }
  }

  changeTheme(themeKey: PuertoRicoThemeKey): void {
    const game = store.gameW.game;
    if (!game) {
      setPreGameThemeKey(themeKey);
      this.props.onPreGameThemeChange?.();
      this.maybeSyncParams();
      return;
    }
    game.themeKey = themeKey;
    this.maybeSyncParams();
    store.update(theme.messages.changedTheme(theme.gameName));
  }

  maybeSyncParams(): void {
    document.title = (this.utils.isMyTurn() ? "(!) " : "") + theme.gameName;
  }

  revert(wrapper: GameWrapperType<GameType>): void {
    const time = new Date(wrapper.info.timestamp).toLocaleTimeString();
    store.update(`restored to [(${wrapper.info.id}) ${wrapper.info.message} ${time}]`, wrapper.game);
  }
}

function playerOrder(player: PlayerType, firstPlayer: number, playerCount: number): number {
  if (playerCount <= 0) return player.index;
  return (player.index - firstPlayer + playerCount) % playerCount;
}

export default Sidebar;
