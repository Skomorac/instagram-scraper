import React, { useState } from "react";
import { Container, Form, Button, ListGroup } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const MySwal = withReactContent(Swal);

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [postLink, setPostLink] = useState("");
  const [commenters, setCommenters] = useState([]);
  const [winner, setWinner] = useState("");
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL_NS;

  const handleFetchComments = async (event) => {
    event.preventDefault();
    setLoading(true);
    setCommenters([]);
    setWinner("");
    setSelectedWinners([]);

    const fetchComments = async () => {
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
        const initialWinner = response.data.winner;
        setWinner(initialWinner);
        setSelectedWinners([initialWinner]);
        setLoading(false);
        MySwal.close();
        Swal.fire({
          title: "Data fetched!",
          text: `Winner is ${initialWinner}`,
          icon: "success",
        });
      } catch (error) {
        setLoading(false);
        MySwal.close();
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

    MySwal.fire({
      title: "Fetching Data",
      text: "Data is being pulled from the server. Please wait, this process can take up to 5 minutes in case of more than 1,000 comments.",
      allowOutsideClick: false,
      showCancelButton: true,
      cancelButtonText: "Cancel",
      didOpen: () => {
        MySwal.showLoading();
        fetchComments();
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        setLoading(false);
      }
    });
  };

  const handleChooseNewWinner = () => {
    const remainingCommenters = commenters.filter(
      (commenter) => !selectedWinners.includes(commenter)
    );
    if (remainingCommenters.length === 0) {
      Swal.fire(
        "No more commenters",
        "All commenters have been selected",
        "info"
      );
      return;
    }
    const newWinner =
      remainingCommenters[
        Math.floor(Math.random() * remainingCommenters.length)
      ];
    setWinner(newWinner);
    setSelectedWinners([...selectedWinners, newWinner]);
    Swal.fire({
      title: "New Winner Selected!",
      text: `New winner is ${newWinner}`,
      icon: "success",
    });
  };

  const getInstagramProfileUrl = (username) => {
    return `https://www.instagram.com/${username}/`;
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

      {!loading && commenters.length > 0 && (
        <>
          <h2>Winner:</h2>
          <p>
            <a
              href={getInstagramProfileUrl(winner)}
              target="_blank"
              rel="noopener noreferrer"
              className="winner-link"
            >
              {winner}
            </a>
          </p>
          <Button variant="secondary" onClick={handleChooseNewWinner}>
            Choose New Winner
          </Button>
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
