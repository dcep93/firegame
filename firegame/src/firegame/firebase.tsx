// https://console.firebase.google.com/u/0/project/firegame-7eb05/database/firegame-7eb05/data/~2F
// jon is u_4110fc9342fd4

import firebase from "firebase/app";
import "firebase/database";
import { gamePath } from "./writer/utils";

const config = { databaseURL: "https://firegame-7eb05.firebaseio.com/" };

var database: { ref: (path: string) => any };
type ResultType = { val: () => BlobType | null };
type BlobType = any;

var latest: string;

var offset: number = 0;
function init(): void {
  firebase.initializeApp(config);
  database = firebase.database();
  // @ts-ignore
  window.clear = () => database.ref("/").set({});
  // @ts-ignore
  window.undo = () => database.ref(`${gamePath()}/${latest}`).set({});
  database
    .ref(".info/serverTimeOffset")
    .once("value")
    .then((data: ResultType) => (offset = data.val()));
}

function now(): number {
  return offset + Date.now();
}

function latestChild(path: string, callback: (value: BlobType) => void): void {
  database
    .ref(path)
    .limitToLast(1)
    .on("value", (snapshot: ResultType) => {
      var val = snapshot.val();
      if (val) latest = Object.keys(val)[0];
      callback(val);
    });
}

function push(path: string, obj: BlobType): void {
  database.ref(path).push(obj);
}

function connect(path: string, callback: (value: BlobType) => void): void {
  database.ref(path).on("value", (snapshot: ResultType) => {
    var val = snapshot.val();
    callback(val);
  });
}

function set(path: string, obj: BlobType): void {
  database.ref(path).set(obj);
}

const ex = { init, now, latestChild, push, connect, set };
export default ex;
