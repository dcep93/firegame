import Shared from "../../../../shared/shared";
import store_, { StoreType } from "../../../../shared/store";
import { SelectedEnum } from "../main/Main";
import { NUM_SCIENCES } from "../main/Science";
import bank from "./bank";
import {
  Age,
  CardType,
  Color,
  CommercialEnum,
  CommercialType,
  GameType,
  PlayerType,
  Resource,
  ScienceEnum,
  ScienceToken,
  StructureCardType,
  WonderType,
} from "./types";

const BASE_COST = 2;
const CARDS_PER_AGE = 20;
const NUM_PURPLES = 3;
const SCIENCE_TO_WIN = 6;
const BASE_TRASH = 2;

class Utils extends Shared<GameType, PlayerType> {
  tokenToPoints: {
    [token in ScienceToken]?: (player: PlayerType) => number;
  } = {
    [ScienceToken.agriculture]: () => 4,
    [ScienceToken.mathematics]: (player: PlayerType) =>
      3 * (player.scienceTokens || []).length,
    [ScienceToken.mysticism]: (player: PlayerType) =>
      2 * (player.tokens || []).length,
    [ScienceToken.philosophy]: () => 7,
  };

  getMilitaryPoints(militaryDiff: number): number {
    if (militaryDiff <= 0) return 0;
    if (militaryDiff <= 2) return 2;
    if (militaryDiff <= 5) return 5;
    return 10;
  }

  currentIndex(game_: GameType | undefined = undefined): number {
    const game: GameType = game_ || store.gameW.game!;
    if (game && game.commercials) return game.commercials[0].playerIndex;
    return super.currentIndex(game_);
  }

  endCommercial(message: string) {
    if (!utils.isMyTurn()) return;
    store.gameW.game.commercials!.shift();
    store.update(message);
  }

  getOpponent(game_: GameType | undefined = undefined) {
    return this.getPlayer(1 - this.myIndex(game_));
  }

  deal(game: GameType) {
    const indices = utils.shuffle(
      bank.cards
        .map((card, index) => ({ card, index }))
        .filter((ic) => ic.card.age === game.age)
        .map((ic) => ic.index)
    );
    const cardsToUse = indices.splice(0, CARDS_PER_AGE);
    if (game.age === Age.two && game.params.godExpansion)
      utils.assignGate(game);
    if (game.age === Age.three) {
      cardsToUse.splice(0, 3);
      const matchAge = game.params.godExpansion ? Age.temple : Age.guild;
      const purples = bank.cards
        .map((card, index) => ({ card, index }))
        .filter((ic) => ic.card.age === matchAge)
        .map((ic) => ic.index);
      cardsToUse.push(...purples.splice(0, NUM_PURPLES));
      utils.shuffle(cardsToUse);
    }
    game.structure = bank.structure[game.age]!.map(
      (mapRow: number[], rowIndex: number) =>
        mapRow.map((offset) => ({
          offset,
          cardIndex: cardsToUse.pop()!,
          revealed: rowIndex % 2 === 0,
          taken: false,
        }))
    );
    var wentFirst;
    const me = utils.getMe();
    const militaryDiff = utils.getMilitary(me);
    if (militaryDiff > 0) {
      wentFirst = utils.getOpponent().index;
    } else if (militaryDiff < 0) {
      wentFirst = me.index;
    } else {
      wentFirst = 1 - game.wentFirst;
    }
    game.currentPlayer = game.wentFirst = wentFirst;
  }

  assignGate(game: GameType) {
    for (let index = 0; index < game.pantheon.length; index++) {
      if (game.pantheon[index] === -1) {
        game.pantheon[index] = bank.gods
          .map((god, godIndex) => ({ god, godIndex }))
          .find((obj) => obj.god.source === undefined)!.godIndex;
      } else if (bank.gods[game.pantheon[index]]?.name === "enki") {
        utils.assignEnki();
      }
    }
  }

  assignEnki() {
    store.gameW.game.enki = utils
      .shuffle(
        store.gameW.game.sciences
          .slice(NUM_SCIENCES)
          .filter((obj) => !obj.taken)
      )
      .slice(0, 2)
      .map((obj) => obj.token);
  }

  getCostCost(rawCosts: Resource[], player: PlayerType): number {
    const cards = player.cards || [];
    const costs = utils.countResources(rawCosts);
    const myResources = utils.countResources(
      cards.flatMap((cardIndex) => bank.cards[cardIndex].extra.resource || [])
    );
    const oppResources = utils.countResources(
      (utils.getPlayer(1 - player.index).cards || []).flatMap(
        (cardIndex) => bank.cards[cardIndex].extra.resource || []
      )
    );
    const discounts = cards.flatMap(
      (cardIndex) => bank.cards[cardIndex].extra.discount || []
    );

    var price = costs[Resource.money] || 0;
    delete costs[Resource.money];

    const paid: {
      [r in Resource]?: { pricePer: number; needed: number };
    } = {};
    Object.keys(costs).forEach((r) => {
      const resource: Resource = r as Resource;
      const needed = costs[resource]! - (myResources[resource] || 0);
      if (needed <= 0) return;
      const pricePer = discounts.includes(resource)
        ? 1
        : BASE_COST + (oppResources[resource] || 0);
      paid[resource] = { pricePer, needed };
      price += needed * pricePer;
    });

    cards
      .map((cardIndex) => bank.cards[cardIndex].extra.resourceOptions)
      .concat(this.getWonderOptions(player))
      .filter(Boolean)
      .forEach((options) => {
        var pricePer = 0;
        var resource: Resource | null = null;
        Object.entries(paid).forEach(([r_, o]) => {
          const r: Resource = r_ as Resource;
          if (o!.needed === 0 || !options?.includes(r)) return;
          if (o!.pricePer > pricePer) {
            pricePer = o!.pricePer;
            resource = r;
          }
        });
        if (resource === null) return;
        const picked: { pricePer: number; needed: number } = paid[resource];
        picked.needed--;
        price -= pricePer;
      });
    return price;
  }

  getWonderOptions(player: PlayerType): Resource[][] {
    return (player.wonders || [])
      .filter((wonder) => wonder.built)
      .map((wonder) => bank.wonders[wonder.wonderIndex])
      .map((wonder) => wonder.resourceOptions)
      .filter(Boolean) as Resource[][];
  }

  getCardCost(card: CardType, player: PlayerType): number {
    if (
      (player.cards || []).find(
        (cardIndex) =>
          card.upgradesFrom !== undefined &&
          bank.cards[cardIndex].upgradesTo === card.upgradesFrom
      )
    )
      return 0;
    if (
      (player.scienceTokens || []).includes(ScienceToken.masonry) &&
      card.color === Color.blue
    )
      return 0;
    if (
      card.age === Age.temple &&
      (player.tokens || []).find(
        (token) => token.isGod && token.value === card.extra!.godUpgrade
      )
    )
      return 0;
    const price = utils.getCostCost(card.cost, player);
    if (
      card.upgradesFrom !== undefined &&
      (player.scienceTokens || []).includes(ScienceToken.engineering) &&
      price > 0
    )
      return 1;
    return price;
  }

  countResources(pool: Resource[]): { [r in Resource]?: number } {
    const resources: { [r in Resource]?: number } = {};
    pool.forEach((resource) => {
      resources[resource] = (resources[resource] || 0) + 1;
    });
    return resources;
  }

  getMilitary(player: PlayerType) {
    const militaryDiff = store.gameW.game.military;
    return player.index === 0 ? militaryDiff : -militaryDiff;
  }

  getScore(player: PlayerType): number {
    const cardPoints = (player.cards || [])
      .map((cardIndex) => bank.cards[cardIndex].extra.points || 0)
      .reduce((a, b) => a + b, 0);
    const moneyPoints = Math.floor(player.money / 3);
    const guildPoints = (player.cards || [])
      .map((cardIndex) => bank.cards[cardIndex].extra.guild)
      .filter(Boolean)
      .map((g) => Math.max(...store.gameW.game.players.map(g!)))
      .reduce((a, b) => a + b, 0);
    const militaryPoints = utils.getMilitaryPoints(utils.getMilitary(player));
    const sciencePoints = (player.scienceTokens || [])
      .map((token) => utils.tokenToPoints[token])
      .filter(Boolean)
      .map((f) => f!(player))
      .reduce((a: number, b: number) => a + b, 0)!;
    const wonderPoints = (player.wonders || [])
      .filter((wonder) => wonder.built)
      .map((wonder) => bank.wonders[wonder.wonderIndex].points || 0)
      .reduce((a, b) => a + b, 0);
    const godPoints = (player.gods || [])
      .map((godIndex) => bank.gods[godIndex])
      .filter((god) => god.points)
      .map((god) => god.points!())
      .reduce((a, b) => a + b, 0);
    const numTemples = (player.cards || []).filter(
      (cardIndex) => bank.cards[cardIndex].age === Age.temple
    ).length;
    const templePoints =
      numTemples === 0 ? 0 : numTemples === 1 ? 5 : numTemples === 2 ? 12 : 21;
    return (
      cardPoints +
      moneyPoints +
      guildPoints +
      militaryPoints +
      sciencePoints +
      wonderPoints +
      godPoints +
      templePoints
    );
  }

  stealMoney(amount: number) {
    utils.getOpponent().money = Math.max(0, utils.getOpponent().money - amount);
  }

  getWonderCost(wonder: WonderType, player: PlayerType): number {
    if ((player.scienceTokens || []).includes(ScienceToken.architecture))
      return 0;
    return utils.getCostCost(wonder.cost, player);
  }

  increaseMilitary(military: number) {
    const me = utils.getMe();
    const sciences = me.scienceTokens || [];
    if (sciences.includes(ScienceToken.polioretics)) utils.stealMoney(military);

    const direction = utils.myIndex() === 0 ? 1 : -1;
    const game = store.gameW.game;
    for (let i = 0; i < military; i++) {
      game.military += direction;
      if (game.military === game.minerva) {
        game.military -= direction;
        delete game.minerva;
        return;
      }
      const diff = Math.abs(game.military);
      const bonus = me.militaryBonuses[diff];
      if (bonus !== undefined) {
        if (bonus === 0) {
          store.gameW.info.alert = `${me.userName} wins`;
        } else {
          delete me.militaryBonuses[diff];
        }
        utils.stealMoney(bonus);
      }
    }
  }

  addCommercial(commercial: CommercialType) {
    if (!store.gameW.game.commercials) store.gameW.game.commercials = [];
    store.gameW.game.commercials.push(commercial);
  }

  enumName<T>(val: string, e: T): keyof T {
    return Object.entries(e).find(([k, v]) => v === val)![0] as keyof T;
  }

  gainScience(science: ScienceEnum) {
    const me = utils.getMe();
    if (!me.scienceIcons) me.scienceIcons = {};
    if (!me.scienceIcons[science]) me.scienceIcons[science] = 0;
    if (++me.scienceIcons[science]! === 2) {
      if (!store.gameW.game.commercials) store.gameW.game.commercials = [];
      store.gameW.game.commercials.push({
        commercial: CommercialEnum.science,
        playerIndex: utils.myIndex(),
      });
    } else if (Object.keys(me.scienceIcons).length === SCIENCE_TO_WIN) {
      store.gameW.info.alert = `${me.userName} wins`;
    }
  }

  isMyCommercial(commercial: CommercialEnum): boolean {
    if (!store.gameW.game.commercials) return false;
    return (
      utils.isMyTurn() &&
      store.gameW.game.commercials[0]?.commercial === commercial
    );
  }

  buyGod(
    selectedPantheon: number,
    usedTokens: { [tokenIndex: number]: boolean } | undefined
  ) {
    const godIndex = store.gameW.game.pantheon[selectedPantheon];
    const god = bank.gods[godIndex];
    const me = utils.getMe();
    var cost =
      3 + (utils.myIndex() === 0 ? 5 - selectedPantheon : selectedPantheon);
    if (god.source === undefined) cost *= 2;
    if (
      (utils.getMe().wonders || []).find(
        (obj) =>
          obj.built && bank.wonders[obj.wonderIndex].name === "the sanctuary"
      )
    )
      cost -= 2;
    Object.keys(usedTokens || {})
      .map((i) => parseInt(i))
      .sort((a, b) => b - a)
      .map((index) => me.tokens!.splice(index, 1)[0].value)
      .forEach((discount) => {
        cost = Math.max(0, cost - discount);
      });
    if (me.money < cost) return alert("cannot afford");
    me.money -= cost;
    if (!me.gods) me.gods = [];
    me.gods.push(godIndex);
    god.f();
    store.gameW.game.pantheon[selectedPantheon] = -1;
    utils.incrementPlayerTurn();
    store.update(`purchased ${god.name}`);
  }

  takeToken(row: number, col: number) {
    const game = store.gameW.game;
    const me = utils.getMe();
    if (!me.tokens) me.tokens = [];
    if (game.age === Age.one) {
      if (col % 2 === 0) {
        utils.addCommercial({
          commercial: CommercialEnum.pickGod,
          playerIndex: utils.myIndex(),
        });
      }
    } else if (game.age === Age.two) {
      if (col % 2 === 0 && row === 1) {
        me.tokens.push({ isGod: false, value: game.discounts.pop()! });
      }
    }
  }

  canTakeCard(y: number, x: number, offset: number): boolean {
    const rowBelow = store.gameW.game.structure[y + 1];
    if (!rowBelow) return true;
    const gridX = x * 2 + offset;
    const cardsBelow = rowBelow.filter(
      (card, index) =>
        !card.taken && Math.abs(card.offset + index * 2 - gridX) === 1
    );
    return cardsBelow.length === 0;
  }

  handleCardGain(card: CardType, isPurchase: boolean) {
    const me = utils.getMe();
    if (card.extra.f) card.extra.f();
    const sciences = me.scienceTokens || [];
    if (
      isPurchase &&
      card.upgradesFrom !== undefined &&
      (me.scienceTokens || []).includes(ScienceToken.urbanism)
    ) {
      if (
        me.cards!.filter(
          (cardIndex) => bank.cards[cardIndex].upgradesTo === card.upgradesFrom
        ).length
      )
        me.money += 4;
    }
    if (card.extra.military) {
      var military = card.extra.military;
      if (sciences.includes(ScienceToken.strategy)) military++;
      utils.increaseMilitary(military);
    }
    if (card.extra.science !== undefined) {
      utils.gainScience(card.extra.science);
    }
  }

  removeFromStructure(structureCard: StructureCardType, y: number) {
    structureCard.taken = true;
    const rowAboveY = y - 1;
    const rowAbove = store.gameW.game.structure[rowAboveY];
    if (rowAbove)
      rowAbove.forEach((aboveCard, index) => {
        if (
          !aboveCard.revealed &&
          utils.canTakeCard(rowAboveY, index, aboveCard.offset)
        ) {
          if (store.gameW.game.params.godExpansion)
            utils.takeToken(rowAboveY, index);
          aboveCard.revealed = true;
        }
      });
  }

  selectCard(
    x: number,
    y: number,
    selectedTarget: SelectedEnum | undefined
  ): string | void {
    if (!utils.isMyTurn()) return;
    const commercial = (store.gameW.game.commercials || [])[0]?.commercial;
    const structureCard = store.gameW.game.structure[y][x];
    if (commercial === CommercialEnum.zeus) {
      utils.removeFromStructure(structureCard, y);
      if (!store.gameW.game.trash) store.gameW.game.trash = [];
      store.gameW.game.trash.push(structureCard.cardIndex);
      utils.endCommercial("destroyed a card");
      return;
    }
    if (commercial) return alert(commercial);
    if (selectedTarget === undefined)
      return alert("need to select a target first");
    if (!utils.canTakeCard(y, x, structureCard.offset))
      return alert("cannot take that card");
    const card = bank.cards[structureCard.cardIndex];
    if (selectedTarget === SelectedEnum.build) {
      const cost = utils.getCardCost(card, utils.getMe());
      if (cost > utils.getMe().money) return alert("cannot afford that card");
      utils.getMe().money -= cost;
      if (
        (utils.getOpponent().scienceTokens || []).includes(ScienceToken.economy)
      ) {
        if (
          !(
            (utils.getMe().scienceTokens || []).includes(
              ScienceToken.urbanism
            ) && card.upgradesFrom !== undefined
          )
        ) {
          const resourceCost = Math.max(
            0,
            cost - card.cost.filter((c) => c === Resource.money).length
          );
          utils.getOpponent().money += resourceCost;
        }
      }
    } else if (selectedTarget >= 0) {
      const cost = utils.getWonderCost(
        bank.wonders[utils.getMe().wonders[selectedTarget!].wonderIndex],
        utils.getMe()
      );
      if (cost > utils.getMe().money) return alert("cannot afford that wonder");
      utils.getMe().money -= cost;
      if (
        (utils.getOpponent().scienceTokens || []).includes(ScienceToken.economy)
      )
        utils.getOpponent().money += cost;
    }
    utils.removeFromStructure(structureCard, y);
    const me = utils.getMe();
    var message;
    if (selectedTarget === SelectedEnum.trash) {
      message = `trashed ${card.name}`;
      if (!store.gameW.game.trash) store.gameW.game.trash = [];
      store.gameW.game.trash.push(structureCard.cardIndex);
      me.money +=
        BASE_TRASH +
        (me.cards || [])
          .map((cardIndex) => bank.cards[cardIndex])
          .filter((card) => card.color === Color.yellow).length;
    } else if (selectedTarget === SelectedEnum.build) {
      message = `built ${card.name}`;
      if (!me.cards) me.cards = [];
      me.cards.push(structureCard.cardIndex);
      utils.handleCardGain(card, true);
    } else {
      const w = utils.getMe().wonders[selectedTarget!];
      w.built = true;
      const wonder = bank.wonders[w.wonderIndex];
      wonder.f();
      if (
        wonder.goAgain ||
        (me.scienceTokens || []).includes(ScienceToken.theology)
      )
        utils.incrementPlayerTurn();
      message = `built ${wonder.name} using ${card.name}`;
      if (
        utils.getMe().wonders.filter((wonder) => !wonder.built).length +
          utils.getOpponent().wonders.filter((wonder) => !wonder.built)
            .length ===
        1
      ) {
        var index;
        if (utils.getMe().wonders.filter((wonder) => !wonder.built).length) {
          index = me.index;
        } else {
          index = 1 - me.index;
        }
        utils.addCommercial({
          commercial: CommercialEnum.destroyWonder,
          playerIndex: index,
        });
      }
    }
    utils.incrementPlayerTurn();
    if (!store.gameW.game.structure.flat().filter((sc) => !sc.taken).length) {
      switch (store.gameW.game.age) {
        case Age.one:
          store.gameW.game.age = Age.two;
          utils.deal(store.gameW.game);
          break;
        case Age.two:
          store.gameW.game.age = Age.three;
          utils.deal(store.gameW.game);
          break;
        case Age.three:
          store.gameW.info.alert = "game over";
          break;
      }
    }
    return message;
  }

  buildScienceToken(scienceName: ScienceToken) {
    if (!utils.isMyTurn()) return;
    const me = utils.getMe();
    if (!me.scienceTokens) me.scienceTokens = [];
    me.scienceTokens.push(scienceName);
    store.gameW.game.sciences.find(
      (obj) => obj.token === scienceName
    )!.taken = true;
    switch (scienceName) {
      case ScienceToken.agriculture:
      case ScienceToken.urbanism:
        utils.getMe().money += 6;
        break;
      case ScienceToken.law:
        utils.gainScience(ScienceEnum.law);
        break;
    }
    utils.endCommercial(`built ${utils.enumName(scienceName, ScienceToken)}`);
  }
}

export const store: StoreType<GameType> = store_;
const utils = new Utils();
export default utils;
