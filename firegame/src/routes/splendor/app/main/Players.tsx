import React from "react";
import styles from "../../../../shared/styles.module.css";
import { Level, Token, TokensGroup, TokenToEmoji } from "../utils/bank";
import { PlayerType } from "../utils/NewGame";
import utils, { store } from "../utils/utils";

class Players extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.bubble}>
          <h2>Players</h2>
          <div>
            {store.gameW.game.players.map((p, index) => (
              <div key={index}>
                <div className={styles.bubble}>
                  <h5 title={this.tokensString(p.tokens || [])}>
                    {p.userName} -{" "}
                    {[
                      `${utils.getScore(p)} points`,
                      `${(p.hand || []).length} hand`,
                      `${p.nobles} nobles`,
                      `${(p.cards || []).length} cards`,
                      `${(p.tokens || []).length} tokens`,
                    ].join(" / ")}
                  </h5>
                  <div className={styles.flex}>
                    {utils.enumArray(Token).map((t) => this.renderCards(t, p))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  renderCards(t: Token, p: PlayerType) {
    const cards = (p.cards || []).filter((c) => c.color === t);
    if (cards.length === 0) return null;
    return (
      <div className={styles.bubble} key={t}>
        {cards.map((c, index) => (
          <div
            key={index}
            title={`Level ${Level[c.level]} - ${utils.cardString(c)}`}
          >
            {TokenToEmoji[c.color]} - ({c.points})
          </div>
        ))}
      </div>
    );
  }

  tokensString(tokens: Token[]) {
    const count: TokensGroup = {};
    tokens.forEach((t) => (count[t] = 1 + (count[t] || 0)));
    return Object.keys(count)
      .map((t) => parseInt(t))
      .map((t: Token) => `${TokenToEmoji[t]} x${count[t]}`)
      .join(" / ");
  }
}

export default Players;
