import React, { useState } from "react";
import store from "../../../../shared/store";
import styles from "../../../../shared/styles.module.css";
import { Color, Tickets } from "../utils/bank";
import utils from "../utils/utils";

function Me(props: {
  selected: { [n: number]: boolean };
  update: (selected: { [n: number]: boolean }) => void;
}) {
  const me = utils.getMe();
  return (
    <div>
      <div>
        <div className={styles.bubble}>
          <h4>
            <span onClick={utils.takeTickets}>Tickets:</span>
          </h4>{" "}
          {me.takenTicketIndices && (
            <TakenTickets ticketIndices={me.takenTicketIndices} />
          )}
          {(me.ticketIndices || [])
            .map((t) => Tickets[t])
            .map((t, i) => (
              <div
                key={i}
                className={styles.bubble}
                style={{
                  backgroundColor: utils.ticketCompleted(t, me)
                    ? "lightgreen"
                    : "pink",
                }}
              >
                {utils.getTicket(t)}
              </div>
            ))}
        </div>
      </div>
      <div className={styles.bubble}>
        <h4>
          <span
            title={`last taken: ${
              me.lastTaken !== undefined && Color[me.lastTaken]
            }`}
            onClick={() => {
              props.update({});
              utils.takeFromDeck();
            }}
          >
            Hand:
          </span>
        </h4>
        {(me.hand || [])
          .map((c, i) => ({ c, i }))
          .flatMap((obj) =>
            me.hand![obj.i - 1] === obj.c ? [obj] : [{ c: -1, i: obj.i }, obj]
          )
          .map((obj, i) =>
            obj.c === -1 ? (
              <div key={i}></div>
            ) : (
              <div
                key={i}
                className={
                  props.selected[obj.i] ? styles.bubble : styles.inline
                }
              >
                {utils.renderCard(obj.c, i, () => {
                  props.selected[obj.i] = !props.selected[obj.i];
                  props.update(utils.copy(props.selected));
                })}
              </div>
            )
          )}
      </div>
    </div>
  );
}

function TakenTickets(props: { ticketIndices: number[] }) {
  const [selected, update] = useState({} as { [n: number]: boolean });
  return (
    <div className={[styles.bubble, styles.grey].join(" ")}>
      <div>
        {props.ticketIndices
          .map((t) => Tickets[t])
          .map((t, i) => (
            <div key={i}>
              <div
                className={styles.bubble}
                onClick={() => {
                  selected[i] = !selected[i];
                  update(utils.copy(selected));
                }}
                style={{
                  backgroundColor: selected[i] ? "lightblue" : "white",
                }}
              >
                {utils.getTicket(t)}
              </div>
            </div>
          ))}
      </div>
      <button
        onClick={() => {
          const selectedIndices = Object.entries(selected)
            .filter(([key, val]) => val)
            .map(([key, val]) => utils.getMe().takenTicketIndices![+key]);
          if (!utils.isMyTurn()) return alert("not your turn");
          if (selectedIndices.length === 0)
            return alert("need to take at least 1 ticket");
          delete utils.getMe().takenTicketIndices;
          if (!utils.getMe().ticketIndices) utils.getMe().ticketIndices = [];
          utils.getMe().ticketIndices!.push(...selectedIndices);
          utils.incrementPlayerTurn();
          store.update(`took ${selectedIndices.length} tickets`);
        }}
      >
        Take Tickets
      </button>
    </div>
  );
}

export default Me;
