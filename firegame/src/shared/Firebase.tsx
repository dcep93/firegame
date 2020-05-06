// https://console.firebase.google.com/u/0/project/firegame-7eb05/database/firegame-7eb05/data/~2F

import firebase from "firebase/app";
import "firebase/database";

const config = { databaseURL: "https://firegame-7eb05.firebaseio.com/" };

var database;

class Firebase {
	static init() {
		firebase.initializeApp(config);
		database = firebase.database();
	}

	static latestChild(path): any {
		return new Promise((resolve) =>
			database.ref(path).limitToLast(1).once("value", resolve)
		).then((result: any) => result.val());
	}

	static push(path, obj) {
		return database.ref(path).push(obj);
	}

	static connect(path, callback) {
		return database.ref(path).on("value", (snapshot) => {
			var val = snapshot.val();
			callback(val);
		});
	}

	static set(path, obj) {
		return database.ref(path).set(obj);
	}
}

export default Firebase;
