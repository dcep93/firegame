// @ts-ignore
import React from "react";

import {
	BrowserRouter as Router,
	Route,
	RouteComponentProps,
	// @ts-ignore
} from "react-router-dom";

import Home from "./firegame/home";

import timeline from "./routes/timeline/app";

const components = { timeline };

function App() {
	return (
		<Router>
			<div>
				<Route exact path="/" component={Home} />
				{getRoutes()}
			</div>
		</Router>
	);
}

function getRoutes() {
	var routes = [];
	for (let [key, value] of Object.entries(components)) {
		routes.push(
			<Route
				key={key}
				path={`/${key}/:roomId(\\d+)?`}
				render={(props: RouteComponentProps) =>
					value(props.match.params.roomId || -1)
				}
			/>
		);
	}
	return <>{routes}</>;
}

export default App;
