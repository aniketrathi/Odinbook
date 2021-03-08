import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "reactstrap";
import CreatePost from "./CreatePost";
import Post from "./Post";
const Posts = (props) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container>
      <CreatePost />
      {posts.map((post, i) => {
        return (
          <div key={i}>
            <Post post={post} />
          </div>
        );
      })}
    </Container>
  );
};

export default Posts;
