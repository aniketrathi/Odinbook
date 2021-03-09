import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  CardTitle,
  CardSubtitle,
  Form,
  Button,
  FormGroup,
  Input,
} from "reactstrap";
import AuthContext from "../../context/auth-context";

const Post = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [new_comment, setNewComment] = useState("");
    const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/posts/${post._id}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  }, []);

  function handleAddComment(e) {
    e.preventDefault();
    const commentData = {
      content: new_comment,
    };
    axios
      .post(`http://localhost:5000/posts/${post._id}/comments`, commentData)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    window.location.href = "/posts";
  }

  function likeHandler(e) {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/posts/${post._id}/like`, { _id: user })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    window.location.href = '/posts';
  }

  function dislikeHandler(e) {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/posts/${post._id}/dislike`, { _id: user })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    window.location.href = '/posts';
  }

  const LikeButton = () => {
    if (post.likes.includes(user))
      return <div onClick={dislikeHandler}> <i className="fas fa-heart" style={{fontSize: "20px", color: "red"}} alt="Dislike"></i> </div>;
    else return <div onClick={likeHandler}> <i className="far fa-heart" style={{fontSize: "20px", color: "red"}} alt="Like"></i> </div>;
  };

  return (
    <Card className="p-2 mb-3">
      <CardBody>
        <CardTitle>
          <Row>
            <Col md={6}>
              <h5>
                <strong>
                  {post.author.firstName} {post.author.lastName}
                </strong>
              </h5>
            </Col>
            <Col md={{ size: 3, offset: 3 }} className="text-right">{new Date(post.createdAt).toLocaleString()}</Col>
          </Row>
        </CardTitle>
        <p className="text-justify">{post.content}</p>
        <CardSubtitle>
          <span className="mr-4">{post.likes.length} Likes</span>
          <span>{comments.length} Comments</span>
        </CardSubtitle>
        <hr />
        {LikeButton()}
        <hr />
        {comments.map((cmnt, i) => {
          return (
            <div key={i}>
              <strong>
                {"> "}
                {cmnt.author.firstName} {cmnt.author.lastName}
              </strong>
              <p className="pl-2">{cmnt.content}</p>
            </div>
          );
        })}
        <br />
        <Form onSubmit={handleAddComment} className="form-inline">
          <FormGroup className="w-75">
            <Input
              type="text"
              name="comment"
              id="newcomment"
              placeholder="New Comment ..."
              value={new_comment}
              className="w-100"
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="Submit" className="w-25">
            {" "}
            Submit{" "}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Post;
