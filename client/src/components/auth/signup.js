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

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { getLoggedIn } = useContext(AuthContext);
  const history = useHistory();

  async function register(e) {
    e.preventDefault();
    try {
      const registerData = {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      };

      await axios.post("http://localhost:5000/auth/", registerData);
      await getLoggedIn();
      history.push("/");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Container>
      <Row>
        <h1>Register your account!</h1>
        <br />
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Form onSubmit={register}>
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
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="password placeholder"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </FormGroup>
            <FormGroup>
              <Label for="firstname">First Name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstname"
                placeholder="John"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </FormGroup>
            <FormGroup>
              <Label for="lastname">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastname"
                placeholder="Doe"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </FormGroup>
            <Button type="submit">Register</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
