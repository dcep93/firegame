// https://console.firebase.google.com/u/0/project/firegame-7eb05/database/firegame-7eb05/data/~2F

import firebase from "firebase/app";
import "firebase/database";

const config = { databaseURL: "https://firegame-7eb05.firebaseio.com/" };

var database: DatabaseType;
type DatabaseType = { ref: (path: string) => any };
type ResultType = { val: () => BlobType | null };
type BlobType = any;

class Firebase {
	static init(): void {
		firebase.initializeApp(config);
		database = firebase.database();
	}

	static latestChildOnce(path: string): BlobType {
		return new Promise((resolve) =>
			database.ref(path).limitToLast(1).once("value", resolve)
		).then((result: any) => result && result.val());
	}

	static latestChild(
		path: string,
		callback: (value: BlobType) => void
	): void {
		database
			.ref(path)
			.limitToLast(1)
			.on("value", (snapshot: ResultType) => {
				var val = snapshot.val();
				callback(val);
			});
	}

	static push(path: string, obj: BlobType) {
		return database.ref(path).push(obj);
	}

	static connect(path: string, callback: (value: BlobType) => void): void {
		database.ref(path).on("value", (snapshot: ResultType) => {
			var val = snapshot.val();
			callback(val);
		});
	}

	static set(path: string, obj: BlobType) {
		return database.ref(path).set(obj);
	}
}

export default Firebase;
