import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ListGroup, ListGroupItem, Container, Spinner } from "reactstrap";

const SearchResults = (props) => {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/users/search/${query}`)
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        setError(error.response.data.message);
      });
    setLoading(true);
  }, [query]);

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
      {loading ? (
        <ListGroup>
          {results.map((result, i) => {
            return (
              <ListGroupItem key={i} tag = "a" href={`/users/${result._id}/`} color="warning">
                {result.firstName} {result.lastName}
              </ListGroupItem>
            );
          })}
        </ListGroup>
      ) : (
        <Spinner color="danger" size={10} />
      )}
    </Container>
  );
};

export default SearchResults;
