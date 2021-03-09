import React from "react";
import { CardImg, Row, Col, CardBody, CardTitle } from "reactstrap";

function ProfileDetail({ user }) {
  return (
    <Row>
      <Col md={6}>
        <CardImg src={`${user.photo}`} className="w-100" style={{maxHeight: "400px"}}/>
      </Col>
      <Col md={6}>
        <CardBody>
          <CardTitle className="display-4">
            {user.firstName} {user.lastName}
          </CardTitle>
        </CardBody>
      </Col>
    </Row>
  );
}

export default ProfileDetail;
