import bank from "./bank";
import { BirdType } from "./NewGame";
import { FoodEnum, HabitatEnum, NestEnum } from "./types";
import utils, { store } from "./utils";

class ABC {
  activationNone() {}

  countDouble() {}

  allDraw() {
    store.gameW.game.players.forEach(utils.draw);
  }

  cacheSeed(bt: BirdType) {
    bt.cache++;
  }

  discardSeedLay2(bt: BirdType) {
    utils.getMe().food[FoodEnum.seed]--;
    utils.layEggs(bt, 2);
  }

  discardTuck2(food: FoodEnum) {
    return (bt: BirdType) => {
      utils.getMe().food[food]--;
      bt.tucked += 2;
    };
  }

  draw() {
    utils.draw(utils.getMe());
  }

  draw2() {
    utils.draw(utils.getMe());
    utils.draw(utils.getMe());
  }

  draw2OthersDraw() {
    utils.draw(utils.getMe());
    store.gameW.game.players.forEach(utils.draw);
  }

  drawAllFaceup() {
    const me = utils.getMe();
    if (!me.hand) me.hand = [];
    store.gameW.game.publicCards = store.gameW.game.publicCards.map((i) => {
      if (i !== -1) me.hand!.push(i);
      return -1;
    });
  }

  everyoneGains(food: FoodEnum) {
    return () => store.gameW.game.players.forEach((p) => p.food[food]++);
  }

  fewestWetlandDraw() {
    const fewest = Math.min(
      ...store.gameW.game.players.map(
        (p) => p.habitats[HabitatEnum.wetland]?.length || 0
      )
    );
    store.gameW.game.players
      .filter((p) => p.habitats[HabitatEnum.wetland]?.length || 0 === fewest)
      .forEach(utils.draw);
  }

  gainAll(food: FoodEnum) {
    return () => {
      store.gameW.game.feeder = store.gameW.game.feeder.filter((f) => {
        if (f !== food) return true;
        utils.getMe().food[food]++;
        return false;
      });
    };
  }

  gainFood(food: FoodEnum, num: number = 1) {
    return () => (utils.getMe().food[food] += num);
  }

  huntDraw(size: number) {
    return (bt: BirdType) => {
      const bird = bank.cards[store.gameW.game.deck.shift()!];
      if (bird.wingspan <= size) bt.tucked++;
      alert(`${bird.name}: ${bird.wingspan}`);
    };
  }

  huntRoll(food: FoodEnum) {
    return (bt: BirdType) => {
      const num = 5 - store.gameW.game.feeder.length;
      const rolled = utils
        .count(num)
        .map((_) => utils.randomFrom(utils.enumArray(FoodEnum)));
      if (rolled.indexOf(food) !== -1) bt.cache++;
      alert(rolled.map((i) => FoodEnum[i]));
    };
  }

  huntRollAll(food: FoodEnum) {
    return (bt: BirdType) => {
      const num = 5 - store.gameW.game.feeder.length;
      const rolled = utils
        .count(num)
        .map((_) => utils.randomFrom(utils.enumArray(FoodEnum)));
      bt.cache += rolled.filter((i) => i === food).length;
      alert(rolled.map((i) => FoodEnum[i]));
    };
  }

  layForEachCavity(bt: BirdType) {
    const eggs = Object.values(utils.getMe().habitats)
      .flatMap((i) => i)
      .map((i) => i!.index)
      .filter((i) => i !== bt.index)
      .map((i) => bank.cards[i])
      .filter((i) => i.nest === NestEnum.wild || i.nest === NestEnum.cavity)
      .length;
    utils.layEggs(bt, eggs);
  }

  layOnAll(nest: NestEnum) {
    return () =>
      Object.values(utils.getMe().habitats)
        .flatMap((i) => i)
        .filter(Boolean)
        .forEach((bt) => {
          const bNest = bank.cards[bt!.index].nest;
          if (bNest === NestEnum.wild || bNest === nest) utils.layEggs(bt!, 1);
        });
  }

  layOnColumn(bt: BirdType) {
    const h = utils.getMe().habitats;
    const column = Object.values(h)
      .map((i) => i!.findIndex((j) => j.index === bt.index))
      .filter((i) => i !== -1)[0];
    Object.values(h).forEach((i) => {
      const b = i![column];
      if (b) utils.layEggs(b, 1);
    });
  }

  layThis(bt: BirdType) {
    utils.layEggs(bt, 1);
  }

  rerollRodentToLay(bt: BirdType) {
    const num = 5 - store.gameW.game.feeder.length;
    const rolled = utils
      .count(num)
      .map((_) => utils.randomFrom(utils.enumArray(FoodEnum)));
    if (rolled.indexOf(FoodEnum.rodent) !== -1) utils.layEggs(bt, 1);
    alert(rolled.map((i) => FoodEnum[i]));
  }
}

const ActivationsBank = new ABC();

export default ActivationsBank;
