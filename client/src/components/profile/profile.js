import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";

const Profile = () => {
  const { userid } = useParams();

  const [currentUser, setCurrentUser] = useState({});

  async function getUser() {
    try {
      const userRes = await axios.get(`http://localhost:5000/users/${userid}`);
      setCurrentUser(userRes.data);
      console.log(userRes.data.friends);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Container>
      <Row>
        <Card>
          <CardImg
            top
            width="30%"
            height="300vw"
            src={`${currentUser.photo}`}
            alt="profile pic"
          />
          <CardBody>
            <CardTitle tag="h5">
              {currentUser.firstName} {currentUser.lastName}
            </CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              {/* {currentUser.friends.length} Friends */}
            </CardSubtitle>
            <Button>Add Friend</Button>
          </CardBody>
        </Card>
        <Col xs="4">
          <hr />
          {/* <Card body inverse color="info">
            <CardTitle tag="h5">Friends</CardTitle>
            {currentUser.friends.map((friend, i) => {
              return (
                <CardText key={i}>
                  <Link to={`/users/${friend._id}`}>
                    {friend.firstName} {friend.lastName}
                  </Link>
                </CardText>
              );
            })}
          </Card> */}
        </Col>
        <Col xs="8"></Col>
      </Row>
    </Container>
  );
};

export default Profile;
