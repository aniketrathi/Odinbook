import axios from "axios";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useHistory } from "react-router-dom";

import React, { useContext, useState } from "react";
import AuthContext from "../../context/auth-context";
import FacebookLogin from "./facebook-login";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { getLoggedIn } = useContext(AuthContext);
  const history = useHistory();

  async function login(e) {
    e.preventDefault();
    try {
      const loginData = {
        email,
        password,
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, loginData);

      await getLoggedIn();
      history.push("/");
    } catch (error) {
      console.error(error.response.data);
      setError(error.response.data.errorMessage);
    }
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
      <Row>
        <h1>Login your Account</h1>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Form onSubmit={login}>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="with a placeholder"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="password placeholder"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FormGroup>
            <Button type="submit">Login</Button>
            <br></br>
            <br />
          </Form>
          <FacebookLogin />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
