import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div style={{ width: '100%' }}>
        <Container fluid className="py-4">
          <Row className="text-center text-md-start">
            <Col xs={12} md={4} className="mb-4 mb-md-0 px-4">
              <h5 className="text-white mb-3">BookAnytime</h5>
              <p className="text-white-50">
                Find your perfect stay anywhere in the world
              </p>
            </Col>

            <Col xs={12} md={3} className="mb-4 mb-md-0 px-4">
              <h5 className="text-white mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-white text-decoration-none">Home</Link>
                </li>
                <li className="mb-2">
                  <Link to="/search" className="text-white text-decoration-none">Search</Link>
                </li>
                <li>
                  <Link to="/list-property" className="text-white text-decoration-none">List Property</Link>
                </li>
              </ul>
            </Col>

            <Col xs={12} md={5} className="mb-4 mb-md-0 px-4">
              <h5 className="text-white mb-3">Contact Us</h5>
              <p className="text-white-50 mb-2">
                <i className="bi bi-envelope me-2"></i> info@bookanytime.com
              </p>
              <p className="text-white-50 mb-3">
                <i className="bi bi-telephone me-2"></i> +1 (123) 456-7890
              </p>

              <div className="social-icons d-flex justify-content-center justify-content-md-start">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                  <FaFacebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                  <FaTwitter size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                  <FaInstagram size={20} />
                </a>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col className="text-center text-white-50">
              <small>&copy; {new Date().getFullYear()} BookAnytime. All rights reserved.</small>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>

  );
}

export default Footer;