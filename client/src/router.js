import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Header from "./components/header";
import Welcome from "./components/welcome";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/">
          <Welcome />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
