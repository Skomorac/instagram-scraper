import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container main-container-home">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Welcome to the Instagram Scraper</h1>
        <p className="hero-subtitle">
          Easily scrape and analyze Instagram posts and comments
        </p>
        <Button
          onClick={() => navigate("/login")}
          variant="primary"
          className="cta-button"
        >
          Get Started
        </Button>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2>About Instagram Scraper</h2>
        <p>
          Instagram Scraper is a tool that allows you to fetch comments, analyze
          user engagement, and select winners for your Instagram giveaways.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>Fetch Comments</h3>
            <p>Easily fetch all comments from any public Instagram post.</p>
          </div>
          <div className="feature-item">
            <h3>Analyze Engagement</h3>
            <p>
              Analyze user engagement with detailed statistics and insights.
            </p>
          </div>
          <div className="feature-item">
            <h3>Select Winners</h3>
            <p>Randomly select winners for your Instagram giveaways.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <Button
          onClick={() => navigate("/signup")}
          variant="success"
          className="cta-button"
        >
          Sign Up Now
        </Button>
      </section>
    </div>
  );
};

export default Home;
