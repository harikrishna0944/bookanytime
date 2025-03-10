import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddOfferModal = ({ show, handleClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleImageChange = (e) => {
    setImage([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !image || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("category", selectedCategory);
    image.forEach((img) => formData.append("images", img));
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/offers/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
            alert("Offer added successfully!");
      handleClose();
    } catch (error) {
      console.error("Error adding offer:", error);
      alert("Failed to add offer.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Offer</Modal.Title>
      </Modal.Header>
      <Modal.Body>


        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Offer Image</Form.Label>
            <Form.Control type="file" multiple accept="image/*" onChange={handleImageChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Form.Group>

          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">Add Offer</Button>
          {/* Inside Add Offers Form Back Button */}
          <Button variant="secondary" className="mt-3 ms-2" onClick={handleClose}>
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddOfferModal;
