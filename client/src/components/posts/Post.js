import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import AuthContext from "../../context/auth-context";

const Post = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [content, setContent] = useState(post.content);
  const [modal, setModal] = useState(false);

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
      content: newComment,
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
    window.location.href = "/posts";
  }

  function dislikeHandler(e) {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/posts/${post._id}/dislike`, { _id: user })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    window.location.href = "/posts";
  }

  const LikeButton = () => {
    if (post.likes.includes(user))
      return (
        <div onClick={dislikeHandler}>
          {" "}
          <i
            className="fas fa-heart"
            style={{ fontSize: "20px", color: "red" }}
            alt="Dislike"
          ></i>{" "}
        </div>
      );
    else
      return (
        <div onClick={likeHandler}>
          {" "}
          <i
            className="far fa-heart"
            style={{ fontSize: "20px", color: "red" }}
            alt="Like"
          ></i>{" "}
        </div>
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const contentData = {
      content,
    };
    axios
      .put(`http://localhost:5000/posts/${post._id}`, contentData)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    window.location.href = "/posts";
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:5000/posts/${post._id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    window.location.href = "/posts";
  };

  const toggle = () => setModal(!modal);

  const editButton = () => {
    return (
      <div>
        <Button color="danger" onClick={toggle}>
          Edit
        </Button>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Content</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Input
                  type="textarea"
                  name="content"
                  id="postcontent"
                  placeholder="Write your post here..."
                  onChange={(e) => setContent(e.target.value)}
                  value={content}
                  required
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={handleSubmit}>
              Update Post
            </Button>{" "}
            <Button color="danger" onClick={handleDelete}>
              Delete Post
            </Button>
          </ModalFooter>
        </Modal>
        <hr />
      </div>
    );
  };

  return (
    <Card className="p-2 mb-3">
      <CardBody>
        <CardTitle>
          <Row>
            <Col md={6}>
              <Link to={`/users/${post.author._id}/`}>
                <h5>
                  <strong>
                    {post.author.firstName} {post.author.lastName}
                  </strong>
                </h5>
              </Link>
            </Col>
            <Col md={{ size: 3, offset: 3 }} className="text-right">
              {new Date(post.createdAt).toLocaleString()}
            </Col>
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

        {user === post.author._id ? editButton() : ""}

        {comments.map((cmnt, i) => {
          return (
            <div key={i}>
              <Link to={`/users/${cmnt.author._id}`}>
                <strong>
                  {"> "}
                  {cmnt.author.firstName} {cmnt.author.lastName}
                </strong>
              </Link>
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
              value={newComment}
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
