import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row } from "reactstrap";
import ProfileDetail from "./ProfileDetail";
import PostList from "./PostList";
import FriendList from "./FriendList";

const Profile = () => {
  const { userid } = useParams();
  const [currentUser, setCurrentUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  async function getUser() {
    try {
      const userRes = await axios.get(`http://localhost:5000/users/${userid}`);
      setCurrentUser(userRes.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserPosts() {
    try {
      const res = await axios.get(
        `http://localhost:5000/users/${userid}/posts`
      );
      setUserPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUser();
    getUserPosts();
  }, []);

  return (
    <Container>
      <ProfileDetail user={currentUser} /> <br/> <hr/>
      <Row>
        <FriendList friends={currentUser.friends} />
        <PostList posts={userPosts} />
      </Row>
    </Container>
  );
};

export default Profile;
