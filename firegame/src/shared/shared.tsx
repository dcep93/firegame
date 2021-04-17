import store from "./store";

export const VERSION: string = "v0.1.2";

interface TurnGame<T extends PlayerType> {
  currentPlayer: number;
  players: T[];
}

interface PlayerType {
  userId: string;
  userName: string;
}

declare global {
  interface Array<T> {
    // @ts-ignore
    sum(): number;
  }
}

// eslint-disable-next-line no-extend-native
Array.prototype.sum = function (this: number[]): number {
  return this.reduce((a, b) => a + b, 0);
};

class Shared<T extends TurnGame<U>, U extends PlayerType> {
  constructor() {
    // @ts-ignore
    window.store = store;
    // @ts-ignore
    window.utils = this;
  }

  isMyTurn(game_: T | undefined = undefined): boolean {
    const game: T = game_ || store.gameW.game!;
    if (!game) return false;
    const current = this.getCurrent(game);
    if (!current) return false;
    return current.userId === store.me.userId;
  }

  incrementPlayerTurn(game_: T | undefined = undefined): void {
    const game: T = game_ || store.gameW.game!;
    game.currentPlayer = this.playerIndexByIndex(game.currentPlayer + 1, game);
  }

  playerIndexByIndex(index: number, game_: T | undefined = undefined): number {
    const game: T = game_ || store.gameW.game!;
    return index % game.players.length;
  }

  playerIndexById(userId: string, game_: T | undefined = undefined): number {
    const game: T = game_ || store.gameW.game!;
    return game.players.map((player) => player.userId).indexOf(userId);
  }

  myIndex(game: T | undefined = undefined): number {
    return this.playerIndexById(store.me.userId, game);
  }

  getPlayer(index: number, game_: T | undefined = undefined): U {
    const game: T = game_ || store.gameW.game!;
    return game.players[index];
  }

  getMe(game_: T | undefined = undefined): U {
    return this.getPlayer(this.myIndex(game_));
  }

  getCurrent(game_: T | undefined = undefined): U {
    return this.getPlayer(this.currentIndex(game_), game_);
  }

  getOpponent(game_: T | undefined = undefined) {
    return this.getPlayer(1 - this.myIndex(game_));
  }

  currentIndex(game_: T | undefined = undefined): number {
    const game: T = game_ || store.gameW.game!;
    return game.currentPlayer;
  }

  randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  arrToDict<T>(arr: T[], f: (t: T) => string): { [key: string]: T[] } {
    const dict: { [key: string]: T[] } = {};
    arr.forEach((t) => {
      const key = f(t);
      if (!dict[key]) dict[key] = [];
      dict[key].push(t);
    });
    return dict;
  }

  static M(index: number) {
    const game: TurnGame<PlayerType> = store.gameW.game;
    const player = game.players[index];
    player.userId = store.me.userId;
    store.update(`is masquerading as ${player.userName}`);
  }

  m(index: number) {
    Shared.M(index);
  }

  repeat<X>(value: X, count: number): X[] {
    return Array.from(new Array(count)).map(() => value);
  }

  count(num: number): number[] {
    return Array.from(new Array(num)).map((_, i) => i);
  }

  enumArray<X>(enumType: X): number[] {
    return Object.values(enumType)
      .filter((e) => typeof e === "number")
      .sort();
  }

  enumNameToValue(name: string, e: { [s: string]: number | string }): number {
    return e[name] as number;
  }

  copy<X>(obj: X): X {
    if (obj && typeof obj === "object") {
      if (Array.isArray(obj)) {
        // @ts-ignore
        return obj.map((val) => this.copy(val));
      }
      const rval: { [key: string]: any } = {};
      Object.entries(obj).forEach(([key, val]) => (rval[key] = this.copy(val)));
      // @ts-ignore
      return rval;
    }
    return obj;
  }

  sCopy<X>(obj: X): X {
    return Object.assign({}, obj);
  }

  objEqual<X>(a: X, b: X): boolean {
    if (a && typeof a === "object") {
      if (!b) return false;
      for (let key in a) {
        if (!this.objEqual(a[key], b[key])) return false;
      }
      return true;
    } else {
      return a === b;
    }
  }

  default(value: any, default_: any): any {
    return value === undefined ? default_ : value;
  }

  removeAll<T>(arr: T[], checker: (t: T) => boolean): T[] {
    return this.count(arr.length)
      .filter((i) => checker(arr[i]))
      .reverse()
      .map((i) => arr.splice(i, 1)[0]);
  }

  idx(original_obj: any[], keys: any[]): any {
    var obj = original_obj;
    for (let i = 0; i < keys.length; i++) {
      obj = obj[keys[i]];
      if (obj === undefined) break;
    }
    return obj;
  }

  objToArr<T>(obj: { [key: number]: T }): T[] {
    const out: T[] = [];
    Object.keys(obj)
      .map((key) => parseInt(key))
      .forEach((key) => (out[key] = obj[key]));
    return out;
  }

  numberToLetter(i: number): string {
    return String.fromCharCode(65 + i);
  }
}

export default Shared;
