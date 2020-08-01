import {
  Action,
  Card,
  Effect,
  Icon,
  StandardProject,
  Tile,
  Token,
  Trigger,
} from "./types";
import utils from "./utils";

export const corporations: Card[] = [
  {
    name: "Arklight",
    text: `$45; $2 prod\nEffect: ${Icon.animal}/${Icon.plant}: ${Token.animal}\nPoints: 1/2${Token.animal}`,
    icons: [Icon.animal],
    play: () => {
      const p = utils.getMe();
      p.pool.money += 45;
      p.prod.money += 2;
    },
    effect: (e: Effect) => {
      if (e.trigger === Trigger.playCard) {
        if (utils.getMe() === e.params.p) {
          const c = e.params.c as Card;
          const i = c.icons || [];
          if (i.indexOf(Icon.animal) !== -1 || i.indexOf(Icon.plant) !== -1)
            e.params.e.numTokens++;
        }
      }
    },
    points: (c: Card) => Math.floor(c.numTokens! / 2),
    tokenType: Token.animal,
  },
  {
    name: "Valley Trust",
    text: `$37; 1/3 Prelude\nEffect: ${Icon.science}: $2 discount`,
    icons: [Icon.earth],
    play: () => (utils.getMe().pool.money += 37),
    effect: (e: Effect) => {
      if (e.trigger === Trigger.getDiscount) {
        const c = e.params as Card;
        if ((c.icons || []).indexOf(Icon.science) !== -1) return 2;
      }
    },
  },
  {
    name: "Inventrix",
    text: "$45; Draw 3\nEffect: Global Requirements +/- 2",
    icons: [Icon.science],
    play: () => {
      const p = utils.getMe();
      p.pool.money += 45;
      utils.addAction(Action.inventrix);
    },
    effect: (e: Effect) => {
      return e.trigger === Trigger.checkRequirements;
    },
  },
  {
    name: "United Nations Mars Initiative",
    text: `$40\nAction: If rating increased this generation, $3: rating`,
    icons: [Icon.earth],
    play: () => (utils.getMe().pool.money += 40),
    action: () => {
      const me = utils.getMe();
      if (me.increasedTFThisTurn) {
        const cost = 3;
        if (me.pool.money >= cost) {
          me.pool.money -= cost;
          utils.finishAction();
        } else {
          alert("Not enough money.");
        }
      } else {
        alert("Did not raise rating this turn.");
      }
    },
  },
  {
    name: "Interplanetary Cinematics",
    text: `$30; 20 steel\nEffect: event: +$2`,
    icons: [Icon.building],
    effect: (e: Effect) => {
      if (e.trigger === Trigger.playCard) {
        if (utils.getMe() === e.params.p) {
          const c = e.params.c as Card;
          if (c.isEvent) utils.getMe().pool.money += 2;
        }
      }
    },
  },
  {
    name: "Robinson Industries",
    text: `$47\nAction: $4: Increase lowest production`,
    icons: [Icon.building],
    action: () => utils.addAction(Action.robinsonIndustries),
  },
  {
    name: "Mining Guild",
    text: `$30; 5 steel; 1 steel prod\nEffect: When placing a tile on an area with steel/titanium placement bonus, increase steal prod.`,
    icons: [Icon.building, Icon.building],
    effect: (e: Effect) => {
      if (e.trigger === Trigger.receivePlacementBonus) {
        const tile = e.params as Tile;
        if (!tile.bonus) return;
        if (tile.bonus.steel || tile.bonus.titanium) utils.getMe().prod.steel++;
      }
    },
  },
  {
    name: "Thorgate",
    text: `$48; 1 energy prod\nEffect: ${Icon.energy}/Power Plant: $3 discount`,
    icons: [Icon.energy],
    effect: (e: Effect) => {
      if (e.trigger === Trigger.getDiscount) {
        const c = e.params as Card;
        if ((c.icons || []).indexOf(Icon.energy) !== -1) return 3;
      }
      if (e.trigger === Trigger.standardProjectDiscount) {
        const p = e.params as StandardProject;
        if (p === StandardProject.powerplant) return 3;
      }
    },
  },
  {
    name: "Saturn Systems",
    text: `$42; 1 titanium prod\nEffect: Any ${Icon.jovian}: $1 prod`,
    icons: [Icon.jovian],
    effect: (e: Effect) => {
      if (e.trigger === Trigger.playCard) {
        const c = e.params.c as Card;
        if ((c.icons || []).indexOf(Icon.jovian)) e.params.p.prod.money++;
      }
    },
  },
  {
    name: "Cheung Shing Mars",
    text: `$44; $3 prod\nEffect: ${Icon.building}: $2 discount`,
    icons: [Icon.building],
    effect: (e: Effect) => {
      if (e.trigger === Trigger.getDiscount) {
        const c = e.params as Card;
        if ((c.icons || []).indexOf(Icon.building) !== -1) return 2;
      }
    },
  },
  {
    name: "Stormcraft Incorporated",
    text: `$48\nAction: ${Token.floater} -> any\nEffect: ${Token.floater} = 2 heat`,
    icons: [Icon.jovian],
    action: () => utils.addAction(Action.stormcraftIncorporated),
    effect: (e: Effect) => {
      // todo
    },
    tokenType: Token.floater,
  },
  {
    name: "helion",
    text: `$42; 3 heat prod\nEffect: use heat as money`,
    icons: [Icon.space],
    effect: (e: Effect) => {
      // todo
    },
  },
  {
    name: "Polyphemos",
    text: `$50; $5 prod; 5 titanium\nEffect: When buying a card to hand, pay $5 instead of $3.`,
    effect: (e: Effect) => {
      // todo
    },
  },
  {
    name: "Tharsis Republic",
    text: `$40; As first action, place a city\nEffect: When anyone places a city tile ON MARS, $1 prod. When you place a city tile, $3.`,
    icons: [Icon.building],
    effect: (e: Effect) => {
      if (e.trigger === Trigger.getDiscount) {
        const c = e.params as Card;
        if ((c.icons || []).indexOf(Icon.building) !== -1) return 2;
      }
    },
  },
  {
    name: "XXX",
    text: `$44; $3 prod\nEffect: ${Icon.building}: $2 discount`,
    icons: [Icon.building],
    effect: (e: Effect) => {
      if (e.trigger === Trigger.getDiscount) {
        const c = e.params as Card;
        if ((c.icons || []).indexOf(Icon.building) !== -1) return 2;
      }
    },
  },
  {
    name: "XXX",
    text: `$44; $3 prod\nEffect: ${Icon.building}: $2 discount`,
    icons: [Icon.building],
    effect: (e: Effect) => {
      if (e.trigger === Trigger.getDiscount) {
        const c = e.params as Card;
        if ((c.icons || []).indexOf(Icon.building) !== -1) return 2;
      }
    },
  },
];
