import axios from "axios";
import React, { useContext } from "react";
import { CardImg, Row, Col, CardBody, CardTitle, Button } from "reactstrap";

import AuthContext from "../../context/auth-context";

function ProfileDetail({ currentUser }) {
  const { user } = useContext(AuthContext);

  async function handleRemoveFriend(e, id) {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/users/${id}/unfriend`, {
        _id: id,
      });
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  }

  async function handleAddFriend(e, id) {
    e.preventDefault();
    try {
      const reqdata = {
        sender: user,
        receiver: id,
      };
      await axios.post(`http://localhost:5000/friendrequests`, reqdata);
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  }

  const friendRequest = () => {
    if (user) {
      if (user.toString() === currentUser._id.toString()) {
        return <></>;
      }
      console.log();
      if (
        currentUser.friends.filter(
          ({ _id }) => _id.toString() === user.toString()
        ).length > 0
      ) {
        return (
          <Button onClick={(e) => handleRemoveFriend(e, currentUser._id)}>
            {" "}
            Remove Friend{" "}
          </Button>
        );
      }
      return (
        <Button onClick={(e) => handleAddFriend(e, currentUser._id)}>
          {" "}
          Add Friend{" "}
        </Button>
      );
    }
  };

  return (
    <Row>
      <Col md={6}>
        <CardImg
          src={`${currentUser.photo}`}
          className="w-100"
          style={{ maxHeight: "400px" }}
        />
      </Col>
      <Col md={6}>
        <CardBody>
          <CardTitle className="display-4">
            {currentUser.firstName} {currentUser.lastName}
          </CardTitle>
          {friendRequest()}
        </CardBody>
      </Col>
    </Row>
  );
}

export default ProfileDetail;
