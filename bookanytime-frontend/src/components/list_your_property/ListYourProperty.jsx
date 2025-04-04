import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const ListProperty = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/list-property`,  // ✅ Fixed URL
        formData  // ✅ Pass formData correctly
      );
      setMessage(response.data.message);
      setFormData({ name: "", phone: "", email: "", category: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">List Your Property</h2>

      {/* WhatsApp Button */}
      <div className="text-center mb-4">
        <a
          href="https://wa.me/918088183625"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success d-flex align-items-center justify-content-center"
          style={{ width: "200px", margin: "0 auto" }}
        >
          <WhatsAppIcon style={{ marginRight: "8px" }} />
          Contact via WhatsApp
        </a>
      </div>

      {/* Success/Error Message */}
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Property Listing Form */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} required />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">Submit</Button>
      </Form>
    </Container>
  );
};

export default ListProperty;
