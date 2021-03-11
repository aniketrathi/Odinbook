import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "reactstrap";

import CreatePost from "./create-post";
import Post from "./post";

const Posts = (props) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/posts`)
      .then((res) => setPosts(res.data))
      .catch((error) => setError(error.response.data.message));
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

  return (
    <Container>
      <CreatePost />
      {handleError(error)}
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
