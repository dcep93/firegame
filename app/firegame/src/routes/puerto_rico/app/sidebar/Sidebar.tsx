import { firebaseUndo } from "../../../../firegame/firebase";
import writer from "../../../../firegame/writer/writer";
import Player from "../../../../shared/components/sidebar/Player";
import SharedSidebar from "../../../../shared/components/sidebar/SharedSidebar";
import { history } from "../../../../shared/components/sidebar/SharedLog";
import { GameWrapperType } from "../../../../shared/store";
import css from "../index.module.css";
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
              <strong>{game.players[game.currentPlayer]?.userName}</strong>
              <span>{theme.labels.round} {game.round}</span>
              </>
            )}
          </div>
        </section>

        <section className={css.sidebarCard}>
          <h2>{theme.labels.controls}</h2>
          <div className={css.controlGrid}>
            <button onClick={this.startNewGame.bind(this)}>{theme.controls.newGame}</button>
            <button onClick={() => firebaseUndo()}>{theme.labels.undo}</button>
            <a className={css.sidebarButton} href="..">
              {theme.labels.home}
            </a>
            <a className={css.sidebarButton} href={this.rules}>
              {theme.labels.rules}
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
              const isCurrent = player?.index === game?.currentPlayer;
              return (
                <div
                  key={userId}
                  className={`${css.lobbyRow} ${isCurrent ? css.currentLobbyRow : ""} ${
                    connected ? "" : css.disconnectedLobbyRow
                  }`}
                >
                  <Player userId={userId} userName={player?.userName || userName} />
                  {player && <span>{player.victoryPoints} VP</span>}
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
            {this.state.history.map((wrapper, index) => (
              <button
                key={index}
                className={css.logEntry}
                onClick={() => this.revert(wrapper)}
              >
                <span className={css.logId}>#{wrapper.info.id}</span>
                <span className={css.logMessage}>{wrapper.info.message}</span>
                <span className={css.logMeta}>
                  {new Date(wrapper.info.timestamp).toLocaleTimeString()}
                </span>
              </button>
            ))}
          </div>
        </section>
      </aside>
    );
  }

  lobbyRows(game: GameType | null): LobbyRow[] {
    const rows = playerLobbyEntries(store.lobby).map(([userId, userName]) => ({
      userId,
      userName,
      player: game?.players.find((candidate) => candidate.userId === userId),
      connected: true,
    }));
    const seen = new Set(rows.map((row) => row.userId));
    (game?.players || []).forEach((player) => {
      if (seen.has(player.userId)) return;
      rows.push({
        userId: player.userId,
        userName: player.userName,
        player,
        connected: false,
      });
    });
    return rows;
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
    const userId = store.me.userId;
    if (store.gameW.info.host !== userId) {
      alert("only the host can revert");
      return;
    }
    const time = new Date(wrapper.info.timestamp).toLocaleTimeString();
    store.update(`restored to [(${wrapper.info.id}) ${wrapper.info.message} ${time}]`, wrapper.game);
  }
}

export default Sidebar;
