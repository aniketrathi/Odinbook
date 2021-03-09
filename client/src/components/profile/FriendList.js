import React, { useState } from "react";
import { Col, Button, Collapse } from "reactstrap";

function FriendList({ friends }) {
  return (
    <Col md={3}>
      <Button style={{ width: "100%", fontSize: "20px" }} className="text-left">
        Friends {/*  <span className="pl-auto">{friends.length}</span> */}
      </Button>
    </Col>
  );
}

export default FriendList;
