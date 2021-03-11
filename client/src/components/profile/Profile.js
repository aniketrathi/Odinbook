import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Spinner } from "reactstrap";

import ProfileDetail from "./profile-detail";
import PostList from "./post-list";
import FriendList from "./friend-list";

const Profile = () => {
  const { userid } = useParams();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState("");

  async function getUser() {
    try {
      setLoading(true);
      const userRes = await axios.get(`http://localhost:5000/users/${userid}`);
      setCurrentUser(userRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getUserPosts() {
    try {
      const res = await axios.get(
        `http://localhost:5000/users/${userid}/posts`
      );
      setUserPosts(res.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  useEffect(() => {
    getUser();
    getUserPosts();
  }, []);

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

  if (!loading)
    return (
      <Container>
        <ProfileDetail currentUser={currentUser} /> <br /> <hr />
        <Row>
          <FriendList friends={currentUser.friends} />
          {error !== "" ? (
            handleError(error)
          ) : (
            <PostList posts={userPosts} />
          )}
        </Row>
      </Container>
    );
  else
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
};

export default Profile;
