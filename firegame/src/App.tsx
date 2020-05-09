import React from "react";

import {
	BrowserRouter as Router,
	Route,
	RouteComponentProps,
	// @ts-ignore
} from "react-router-dom";

import Home from "./firegame/components/Home";
import GameWrapper from "./firegame/components/GameWrapper";

import Games from "./firegame/Games";
import Store from "./shared/Store";

function App() {
	return (
		<Router>
			<div>
				<Route exact path="/" render={Home} />
				{getRoutes()}
			</div>
		</Router>
	);
}

function getRoutes(): JSX.Element {
	const routes: JSX.Element[] = [];
	for (let [gameName, component] of Object.entries(Games)) {
		routes.push(
			<Route
				key={gameName}
				path={`/${gameName}/:roomId(\\d+)?`}
				render={(props: RouteComponentProps) => (
					<GameWrapper
						component={component}
						gameName={gameName}
						roomId={props.match.params.roomId || -1}
					/>
				)}
			/>
		);
	}
	return <>{routes}</>;
}

export default App;
