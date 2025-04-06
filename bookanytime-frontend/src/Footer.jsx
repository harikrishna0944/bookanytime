import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer style="width: 100%; background-color: #212529; color: #fff; padding: 40px 20px; box-sizing: border-box;">
  <div style="display: flex; justify-content: space-between; flex-wrap: wrap; max-width: 1200px; margin: 0 auto;">
    
    <div style="flex: 1 1 200px; margin-bottom: 20px;">
      <h3 style="margin-bottom: 10px;">BookAnytime</h3>
      <p>Find your perfect stay anywhere in the world</p>
    </div>

    <div style="flex: 1 1 200px; margin-bottom: 20px;">
      <h4 style="margin-bottom: 10px;">Quick Links</h4>
      <ul style="list-style: none; padding: 0;">
        <li><a href="/" style="color: #fff; text-decoration: none;">Home</a></li>
        <li><a href="/search" style="color: #fff; text-decoration: none;">Search</a></li>
        <li><a href="/list-property" style="color: #fff; text-decoration: none;">List Property</a></li>
      </ul>
    </div>

    <div style="flex: 1 1 200px; margin-bottom: 20px;">
      <h4 style="margin-bottom: 10px;">Contact Us</h4>
      <p>Email: <a href="mailto:info@bookanytime.com" style="color: #fff;">info@bookanytime.com</a></p>
      <p>Phone: +1 (123) 456-7890</p>
      <div style="margin-top: 10px;">
        <a href="#" style="margin-right: 10px; color: #fff;">Facebook</a>
        <a href="#" style="margin-right: 10px; color: #fff;">Twitter</a>
        <a href="#" style="color: #fff;">Instagram</a>
      </div>
    </div>

  </div>

  <div style="text-align: center; padding-top: 20px; border-top: 1px solid #444; margin-top: 20px;">
    <p style="margin: 0;">© 2025 BookAnytime. All rights reserved.</p>
  </div>
</footer>

  );
}

export default Footer;