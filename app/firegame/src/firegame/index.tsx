import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { recorded_sha } from "../recorded_sha";
import GameWrapper from "./components/GameWrapper";
import Home from "./components/Home";
import games from "./games";

function App() {
  console.log(recorded_sha);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {getRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

function getRoutes(): JSX.Element {
  const routes: JSX.Element[] = [];
  for (let [gameName, component] of Object.entries(games)) {
    routes.push(
      <Route key={gameName} path={`/${gameName}`}>
        <Route
          path={`:roomId`}
          element={
            <X
              GetElement={(params) => (
                <GameWrapper
                  component={component}
                  gameName={gameName}
                  roomId={params.roomId}
                />
              )}
            />
          }
        />
        <Route
          path={``}
          element={
            <GameWrapper
              component={component}
              gameName={gameName}
              roomId={-1}
            />
          }
        />
      </Route>
    );
  }
  return <>{routes}</>;
}

function X(props: { GetElement: (params: { [field: string]: any }) => any }) {
  const params = useParams();
  return props.GetElement(params);
}

export default App;
