// https://console.firebase.google.com/u/0/project/firebase-320421/database/firebase-320421-default-rtdb/data
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
import { namespace } from "./writer/utils";

const config = {
  databaseURL: "https://firebase-320421-default-rtdb.firebaseio.com/",
};

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
  const clearF = () => f_set(ref(database, namespace()), {});
  // @ts-ignore
  window.clear = clearF;
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
