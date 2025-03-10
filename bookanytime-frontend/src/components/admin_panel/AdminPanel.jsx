import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./AdminPanel.css"; // Add a separate CSS file for better responsiveness

const AdminPanel = () => {
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mainHeader = document.querySelector(".main-header");
    if (mainHeader) mainHeader.style.display = "none";
    return () => {
      if (mainHeader) mainHeader.style.display = "block";
    };
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setCategory("");
    setImage(null);
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    if (!category.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("name", category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Category added successfully!");
      console.log(response.data);
      handleClose();
    } catch (error) {
      console.error("Error adding category:", error);
      alert(`Failed to add category. ${error.response?.data?.message || "Server error"}`);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h3>BookAnytime - Admin Panel</h3>
      </header>

      {/* Sidebar */}
      <nav className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* <h2>Admin Panel</h2> */}
        <ul>
          <li><Link to="/admin/properties" onClick={() => setSidebarOpen(false)}>Properties</Link></li>
          <li><Link to="/admin/offers" onClick={() => setSidebarOpen(false)}>Offers</Link></li>
          <li><Link to="tracked_data" onClick={() => setSidebarOpen(false)}>Tracked Data</Link></li>
        </ul>
        <Button variant="success" className="add-category-btn" onClick={handleShow}>
          + Add Category
        </Button>
      </nav>

      {/* Page Content */}
      <div className="admin-content">
        <Outlet />
      </div>

      {/* Add Category Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="categoryImage" className="mt-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Preview" className="preview-image" />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleAddCategory}>Add</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;
