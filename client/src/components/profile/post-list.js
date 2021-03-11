import React from "react";
import { Col } from "reactstrap";

import Post from "../posts/post";

function PostList({ posts }) {
  return (
    <Col md={9}>
      {posts.map((post, i) => {
        return (
          <div key={i}>
            <Post post={post} />
          </div>
        );
      })}
    </Col>
  );
}

export default PostList;
