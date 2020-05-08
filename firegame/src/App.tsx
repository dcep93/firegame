import React from "react";

import {
	BrowserRouter as Router,
	Route,
	RouteComponentProps,
	// @ts-ignore
} from "react-router-dom";

import Home from "./firegame/components/Home";
import Wrapper from "./firegame/wrapper";

import Games from "./firegame/Games";
import Store from "./shared/Store";

function App() {
	Store.init();
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
	for (let [name, component] of Object.entries(Games)) {
		routes.push(
			<Route
				key={name}
				path={`/${name}/:roomId(\\d+)?`}
				render={(props: RouteComponentProps) => (
					<Wrapper
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

export default App;
