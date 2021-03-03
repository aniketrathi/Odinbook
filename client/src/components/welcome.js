import React from "react";
import { Jumbotron, Container } from "reactstrap";

const Welcome = (props) => {
  return (
    <div>
      <Jumbotron fluid>
        <Container fluid>
          <h1 className="display-3">Odinbook</h1>
          <p className="lead">
            Odinbook is a social utility that connects you with the people
            around you.
          </p>
        </Container>
      </Jumbotron>
    </div>
  );
};

export default Welcome;
