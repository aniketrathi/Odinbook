import React, { useState } from "react";
import { Col, ListGroupItem, ListGroup } from "reactstrap";

function FriendList({ friends }) {
  async function switchProfile(e, id) {
    e.preventDefault();
    window.location.href = `/users/${id}`;
  }
  return (
    <Col md={3}>
      <ListGroup>
        <ListGroupItem active>
          <span style={{ fontSize: "20px" }}>Friends</span>{" "}
          <span className="float-right">{friends.length}</span>
        </ListGroupItem>
        {friends.map((friend, i) => {
          return (
            <ListGroupItem
              key={i}
              tag="a"
              onClick={(e) => switchProfile(e, friend._id)}
              action
            >
              {friend.firstName} {friend.lastName}
            </ListGroupItem>
          );
        })}
      </ListGroup>
    </Col>
  );
}

export default FriendList;
