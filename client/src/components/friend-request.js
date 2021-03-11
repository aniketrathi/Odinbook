import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";

import AuthContext from "../context/auth-context";

const FriendRequest = (props) => {
  const [requestList, setRequestList] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/users/${user}/friendrequests/`)
        .then((response) => {
          setRequestList(response.data);
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    }
  }, [user]);

  async function acceptRequest(e, senderId, requestId) {
    e.preventDefault();
    const requestData = {
      _id: senderId,
    };
    await axios.put(`http://localhost:5000/users/${user}/friend`, requestData);
    await axios.delete(`http://localhost:5000/friendrequests/${requestId}`);
    window.location.href = `/users/${senderId}/`;
  }

  async function deleteRequest(e, senderId, requestId) {
    e.preventDefault();
    await axios.delete(`http://localhost:5000/friendrequests/${requestId}`);
    window.location.href = `/users/${senderId}/`;
  }

  const handleError = (error) => {
    if (error !== "") {
      return (
        <>
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </>
      );
    }
  };

  return (
    <Container>
      {handleError(error)}
      <div>
        {requestList.map((request, i) => {
          return (
            <Row
              key={i}
              style={{
                backgroundColor: "#F7CAC9",
                borderRadius: "20px",
                padding: "5px",
              }}
            >
              <Col>
                <Link to={`/users/${request.sender._id}/`}>
                  <h4>
                    <strong>
                      {" "}
                      {request.sender.firstName} {request.sender.lastName}
                    </strong>
                  </h4>
                </Link>
              </Col>
              <Col>
                <Button
                  color="success"
                  onClick={(e) =>
                    acceptRequest(e, request.sender._id, request._id)
                  }
                >
                  Accept
                </Button>
              </Col>
              <Col>
                <Button
                  color="danger"
                  onClick={(e) =>
                    deleteRequest(e, request.sender._id, request._id)
                  }
                >
                  Reject
                </Button>
              </Col>
            </Row>
          );
        })}
      </div>
    </Container>
  );
};

export default FriendRequest;
