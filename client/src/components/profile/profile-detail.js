import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { CardImg, Row, Col, CardBody, CardTitle, Button } from "reactstrap";

import AuthContext from "../../context/auth-context";

function ProfileDetail({ currentUser }) {
  const { user } = useContext(AuthContext);
  const [friendRequestId, setFriendRequestId] = useState("");
  const [requestedUser, setRequestedUser] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${currentUser._id}/friendrequests/`)
      .then((response) => {
        const requestFromUser = response.data.find(
          (request) => request.sender._id === user
        );

        if (requestFromUser == null) {
          setFriendRequestId("");
        } else {
          setFriendRequestId(requestFromUser._id);
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            return;
          }
        }
      });
  }, [currentUser._id, user]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/${user}/friendrequests/`)
      .then((response) => {
        const requestFromUser = response.data.find(
          (request) => request.sender._id === currentUser._id
        );

        if (requestFromUser == null) {
          setRequestedUser(false);
        } else {
          setRequestedUser(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            return;
          }
        }
      });
  }, [currentUser._id, user]);

  async function handleRemoveFriend(e, id) {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${user}/unfriend`, {
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
      await axios.post(`${process.env.REACT_APP_API_URL}/friendrequests`, reqdata);
    } catch (err) {
      console.log(err);
    }
    window.location.reload();
  }

  function seeFriendRequest(e) {
    e.preventDefault();
    window.location.href = `/users/${user}/friendrequests`;
  }

  async function deleteRequest(e, requestId) {
    e.preventDefault();
    await axios.delete(`${process.env.REACT_APP_API_URL}/friendrequests/${requestId}`);
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
      } else if (requestedUser) {
        return (
          <Button onClick={(e) => seeFriendRequest(e)}> Friend Request </Button>
        );
      } else if (friendRequestId !== "") {
        return (
          <Button onClick={(e) => deleteRequest(e, friendRequestId)}>
            {" "}
            Unsent Request{" "}
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
