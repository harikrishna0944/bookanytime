import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { TextField, MenuItem, Button, Grid, Paper, Typography, CircularProgress, Chip } from "@mui/material";

const AdminPropertyForm = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    city: "",
    address: "",
    latitude: "",
    longitude: "",
    amenities: [],
    adults: "",
    bedrooms: "",
    images: [],
    whatsappNumber: ""
  });

  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const amenitiesOptions = ["WiFi", "Swimming Pool", "Other"];
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleAmenitySelect = (e) => {
    const value = e.target.value;
    setSelectedAmenity(value);
    if (value !== "Other" && !formData.amenities.includes(value)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, value] }));
    }
  };

  const handleAddNewAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((amenity) => amenity !== amenityToRemove)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      setSelectedCategory(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();

    // Append images
    imageFiles.forEach((file) => formDataToSend.append("images", file));

    // Append other fields
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Remove previously appended values to avoid duplicates
    formDataToSend.delete("adults");
    formDataToSend.delete("bedrooms");

    // Append capacity fields separately
    formDataToSend.append("adults", String(Number(formData.adults) || 0));
    formDataToSend.append("bedrooms", String(Number(formData.bedrooms) || 0));

    try {
      await axios.post("http://localhost:5000/api/properties", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      city: "",
      address: "",
      latitude: "",
      longitude: "",
      amenities: [],
      adults: "",
      bedrooms: "",
      images: [],
      whatsappNumber: ""
    });
    setImageFiles([]);
    setSelectedAmenity("");
    setSelectedCategory("")
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Add New Property
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Property Name */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Property Name" name="name" value={formData.name} onChange={handleChange} required />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Category" name="category" value={selectedCategory} onChange={handleChange} required>

              {categories.map((option) => (
                <MenuItem key={option._id} value={option.name}>{option.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField fullWidth label="Description" name="description" multiline rows={3} value={formData.description} onChange={handleChange} required />
          </Grid>

          {/* Price */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Price" name="price" value={formData.price} onChange={handleChange} required />
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} required />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} required />
          </Grid>

          {/* Latitude & Longitude */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Latitude" name="latitude" value={formData.latitude} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Longitude" name="longitude" value={formData.longitude} onChange={handleChange} required />
          </Grid>

          {/* Amenities */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Selected Amenities:</Typography>
            {formData.amenities.map((amenity, index) => (
              <Chip key={index} label={amenity} onDelete={() => handleRemoveAmenity(amenity)} style={{ margin: 4 }} />
            ))}
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Select Amenity" value={selectedAmenity} onChange={handleAmenitySelect}>
              {amenitiesOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {selectedAmenity === "Other" && (
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Enter New Amenity" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} />
              <Button onClick={handleAddNewAmenity} variant="contained" color="primary" style={{ marginTop: 8 }}>
                Add Amenity
              </Button>
            </Grid>
          )}

          {/* Capacity */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Adults Capacity" name="adults" value={formData.adults} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <input type="file" multiple ref={fileInputRef} onChange={handleImageChange} />
          </Grid>

          {/* WhatsApp Number */}
          <Grid item xs={12}>
            <TextField fullWidth label="WhatsApp Number" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required />
          </Grid>

          {/* Submit and Cancel Buttons */}
          <Grid item xs={12} style={{ textAlign: "center", display: "flex", justifyContent: "center", gap: "10px" }}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="outlined" color="default" onClick={() => navigate("/admin/properties")}>
              Go Back
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AdminPropertyForm;
