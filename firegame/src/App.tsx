import React from "react";

import { Route, BrowserRouter as Router } from "react-router-dom";
import "./App.css";

import Home from "./firegame/home";
import Timeline from "./routes/timeline/app";

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
	var routes = [<Route path="/timeline" component={Timeline} />];
	return <>{routes}</>;
}

export default App;
