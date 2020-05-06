// https://console.firebase.google.com/u/0/project/firegame-7eb05/database/firegame-7eb05/data/~2F

import app from "firebase/app";

const config = { databaseURL: "https://firegame-7eb05.firebaseio.com/" };

class Firebase {
	static init() {
		console.log("init");
		if (app.apps.length) return;
		app.initializeApp(config);
	}

	static connect(path, callback) {
		console.log("connect", path);
		return Promise.resolve();
	}

	static set(path, obj) {
		console.log("set", path);
		return Promise.resolve();
	}
}

export default Firebase;
