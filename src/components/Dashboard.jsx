import React, { useState } from "react";
import { Container, Form, Button, ListGroup, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [postLink, setPostLink] = useState("");
  const [commenters, setCommenters] = useState([]);
  const [winner, setWinner] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleFetchComments = async (event) => {
    event.preventDefault();
    setLoading(true);
    setCommenters([]);
    setWinner("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backendUrl}/api/fetch-comments-instaloader-batch`,
        { username, password, postLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sortedCommenters = response.data.commenters.sort((a, b) =>
        a.localeCompare(b)
      );
      setCommenters(sortedCommenters);
      setWinner(response.data.winner);
      setLoading(false);
      Swal.fire({
        title: "Data fetched!",
        text: `Winner is ${response.data.winner}`,
        icon: "success",
      });
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        Swal.fire({
          title: "Session expired",
          text: "Your session has expired, please log in again.",
          icon: "warning",
        }).then(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
      } else {
        setPostLink("");
        setWinner("");
        setCommenters([]);
        Swal.fire("Error", "Could not fetch comments", "error");
      }
      console.error("Error fetching comments", error);
    }
  };

  return (
    <Container className="main-container-dashboard">
      <h1>Instagram Giveaway Picker</h1>
      <Form onSubmit={handleFetchComments}>
        <Form.Group controlId="formUsername">
          <Form.Label>Instagram Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Instagram Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPostLink">
          <Form.Label>Instagram Post Link</Form.Label>
          <Form.Control
            type="text"
            value={postLink}
            onChange={(e) => setPostLink(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          Fetch Comments and Pick Winner
        </Button>
      </Form>

      {loading && (
        <div className="loading-screen">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <p>Data is being pulled from the server. Please wait...</p>
        </div>
      )}

      {!loading && commenters.length > 0 && (
        <>
          <h2>Winner:</h2>
          <p>{winner}</p>
          <p>Total number of commenters: {commenters.length}</p>

          <h2>All Commenters:</h2>
          <ListGroup>
            {commenters.map((commenter, index) => (
              <ListGroup.Item key={index}>
                {index + 1}. {commenter}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
