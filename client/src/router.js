import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./components/auth/login";
import Register from "./components/auth/signup";
import Header from "./components/header";
import Profile from "./components/profile/profile";
import Welcome from "./components/welcome";
import AuthContext from "./context/auth-context";
import Posts from "./components/posts/posts";
import SearchResults from "./components/search";
import FriendRequest from "./components/friend-request";

function Router() {
  const { loggedIn } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/">
          <Welcome />
        </Route>
        {loggedIn === true && (
          <>
            <Route exact path="/posts">
              <Posts />
            </Route>
            <Route exact path="/users/:userid">
              <Profile />
            </Route>
            <Route exact path="/search/:query">
              <SearchResults />
            </Route>
            <Route exact path="/users/:userid/friendrequests">
              <FriendRequest />
            </Route>
          </>
        )}
        {loggedIn === false && (
          <>
            <Route exact path="/auth">
              <Register />
            </Route>
            <Route path="/auth/login">
              <Login />
            </Route>
          </>
        )}
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
