import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Jumbotron, Container } from "reactstrap";

import AuthContext from "../context/auth-context";

const Welcome = (props) => {
  const { loggedIn } = useContext(AuthContext);

  return (
    <div>
      <Jumbotron fluid>
        <Container>
          <h1 className="display-3">Odinbook</h1>
          <p className="lead">
            Odinbook is a social utility that connects you with the people
            around you.
          </p>
          {loggedIn === true && (
            <Link to="/posts" className="text-center btn btn-dark">
              Jump to Posts
            </Link>
          )}
        </Container>
      </Jumbotron>
    </div>
  );
};

export default Welcome;
