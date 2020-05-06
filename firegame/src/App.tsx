import React from "react";

import {
	BrowserRouter as Router,
	Route,
	RouteComponentProps,
	// @ts-ignore
} from "react-router-dom";

import Home from "./firegame/Home";
import Wrapper from "./firegame/wrapper";
import Firebase from "./firegame/Firebase";

import Components from "./firegame/Components";

const VERSION: string = "v0.0.3";

function App() {
	init();
	return (
		<Router>
			<div>
				<Route exact path="/" component={Home} />
				{getRoutes()}
			</div>
		</Router>
	);
}

function getRoutes(): JSX.Element {
	const routes: JSX.Element[] = [];
	for (let [name, component] of Object.entries(Components)) {
		routes.push(
			<Route
				key={name}
				path={`/${name}/:roomId(\\d+)?`}
				render={(props: RouteComponentProps) => (
					<Wrapper
						userId={localStorage.userId}
						component={component}
						name={name}
						roomId={props.match.params.roomId || -1}
					/>
				)}
			/>
		);
	}
	return <>{routes}</>;
}

function init() {
	Firebase.init();
	setUserId();
}

function setUserId(): void {
	if (localStorage.version !== VERSION) {
		localStorage.version = VERSION;
		localStorage.userId = `u_${Math.random().toString(16).substr(2)}`;
	}
}

export default App;
