// https://console.firebase.google.com/u/0/project/firebase-320421/database/firebase-320421-default-rtdb/data
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

import {
  Database,
  push as f_push,
  set as f_set,
  getDatabase,
  limitToLast,
  onValue,
  query,
  ref,
} from "firebase/database";
import { gamePath, namespace } from "./writer/utils";

const config = {
  apiKey: "AIzaSyD6FMqmSTbv-cxRkgWZ7-iyPVTUlkVzjuM",
  authDomain: "fir-320421.firebaseapp.com",
  databaseURL: "https://firebase-320421-default-rtdb.firebaseio.com",
  projectId: "firebase-320421",
  storageBucket: "firebase-320421.appspot.com",
  messagingSenderId: "532025077082",
  appId: "1:532025077082:web:0570d675c7caac9bca9763",
  measurementId: "G-7M3Q897DJW",
};

export var firebaseId: string;

export function firebaseUndo() {
  f_set(ref(database, `${gamePath()}/${firebaseId}`), {});
}

export function firebaseClear() {
  f_set(ref(database, namespace()), {});
}

var database: Database;
type ResultType = { val: () => BlobType | null };
type BlobType = any;

var offset: number = 0;
var initialized = false;
function init(): void {
  if (initialized) return;
  initialized = true;
  var app = initializeApp(config);
  database = getDatabase(app);
  const analytics = getAnalytics(app);
  console.log("firebase", analytics);
  onValue(ref(database, ".info/serverTimeOffset"), (snap: ResultType) => {
    offset = snap.val();
  });
}

function now(): number {
  return offset + Date.now();
}

function latestChild(path: string, callback: (value: BlobType) => void): void {
  onValue(
    query(ref(database, path), limitToLast(1)),
    (snapshot: ResultType) => {
      var val = snapshot.val();
      if (val) firebaseId = Object.keys(val)[0];
      callback(val);
    }
  );
}

function push(path: string, obj: BlobType): void {
  console.log(obj);
  f_push(ref(database, path), obj).then((pushed) => pushed.key!);
}

function connect(path: string, callback: (value: BlobType) => void): void {
  onValue(ref(database, path), (snapshot: ResultType) => {
    var val = snapshot.val();
    callback(val);
  });
}

function set(path: string, obj: BlobType): void {
  f_set(ref(database, path), obj);
}

const ex = { init, now, latestChild, push, connect, set };
export default ex;
