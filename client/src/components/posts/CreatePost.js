import React, { useState, useContext } from 'react';
import axios from "axios";
import { Button, Container, Form, FormGroup, Input } from 'reactstrap';
import AuthContext from "../../context/auth-context";

const CreatePost = (props) => {
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const postdata = {
                content,
                likes: [],
                author: user
            }

            await axios.post("http://localhost:5000/posts/",postdata);
            window.location.href='/posts';
        } catch(error) {
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
            <br/>
            {handleError(error)}
            <Form onSubmit={handleSubmit}>
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
                <Button type="submit"> Post </Button>
            </Form>
            <br/>
        </Container>
    );
}

export default CreatePost;