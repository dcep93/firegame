// https://console.firebase.google.com/u/0/project/firegame-7eb05/database/firegame-7eb05/data/~2F

import firebase from "firebase/app";
import "firebase/database";

const config = { databaseURL: "https://firegame-7eb05.firebaseio.com/" };

var database: any;

class Firebase {
	static init() {
		firebase.initializeApp(config);
		database = firebase.database();
	}

	static latestChild(path: string): any {
		return new Promise((resolve) =>
			database.ref(path).limitToLast(1).once("value", resolve)
		).then((result: any) => result.val());
	}

	static push(path: string, obj: any) {
		return database.ref(path).push(obj);
	}

	static connect(path: string, callback: (value: any) => void): void {
		database.ref(path).on("value", (snapshot: any) => {
			var val = snapshot.val();
			callback(val);
		});
	}

	static set(path: string, obj: any) {
		return database.ref(path).set(obj);
	}
}

export default Firebase;
