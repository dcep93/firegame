import React from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
} from "react-router-dom";
import GameWrapper from "./firegame/components/GameWrapper";
import Home from "./firegame/components/Home";
import games from "./firegame/games";

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

function getRoutes(): JSX.Element {
  const routes: JSX.Element[] = [];
  for (let [gameName, component] of Object.entries(games)) {
    routes.push(
      <Route
        key={gameName}
        path={`/${gameName}/:roomId(\\d+)?`}
        // @ts-ignore
        render={(props: RouteComponentProps<{ roomId: string }>) => (
          <GameWrapper
            component={component}
            gameName={gameName}
            roomId={parseInt(props.match.params.roomId) || -1}
          />
        )}
      />
    );
  }
  return <>{routes}</>;
}

export default App;
