import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
} from "react-router-dom";
import { recorded_sha } from "../recorded_sha";
import GameWrapper from "./components/GameWrapper";
import Home from "./components/Home";
import games from "./games";

function App() {
  console.log(recorded_sha);
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
