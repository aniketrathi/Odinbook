import axios from "axios";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../../context/auth-context";
function Logout() {
  const { getLoggedIn } = useContext(AuthContext);

  const history = useHistory();

  async function logOut() {
    await axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`);
    await getLoggedIn();
    history.push("/");
  }

  return <button onClick={logOut}>Log out</button>;
}

export default Logout;
