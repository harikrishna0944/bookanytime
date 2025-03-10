import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, MenuItem, Button, Grid, Paper, Typography, CircularProgress, Chip } from "@mui/material";

const UpdatePropertyPage = () => {
  const { id } = useParams(); // Get property ID from URL
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
console.log("id", id)
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

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const amenitiesOptions = ["WiFi", "Swimming Pool", "Other"];
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  
  // Fetch property details when component mounts
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`);
        setFormData(response.data);
        console.log("data from backend",response.data)
      } catch (error) {
        console.error("Error fetching property:", error);
        alert("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  // Handle Amenity Selection
  const handleAmenitySelect = (e) => {
    const value = e.target.value;
    setSelectedAmenity(value);
    if (value !== "Other" && !formData.amenities.includes(value)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, value] }));
    }
  };

  // Handle Adding Custom Amenity
  const handleAddNewAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, newAmenity] }));
      setNewAmenity("");
    }
  };

  // Handle Amenity Removal
  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((amenity) => amenity !== amenityToRemove)
    }));
  };

  // Handle Form Submission (Update Property)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();

    // Append images if new ones are selected
    imageFiles.forEach((file) => formDataToSend.append("images", file));

    // Append other fields
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Property updated successfully!");
      navigate("/"); // Redirect to admin properties page
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "800px", margin: "20px auto" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Update Property
      </Typography>
      {loading ? <CircularProgress /> : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Property Name */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Property Name" name="name" value={formData.name} onChange={handleChange} required />
            </Grid>

            {/* Category */}
            {/* <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} required>
                <MenuItem value="Farmhouse">Farmhouse</MenuItem>
                <MenuItem value="Banquet Hall">Banquet Hall</MenuItem>
                <MenuItem value="Service Apartment">Service Apartment</MenuItem>
              </TextField>
            </Grid> */}

            <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} required>

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

            {/* Image Upload */}
            <Grid item xs={12}>
              <input type="file" multiple ref={fileInputRef} onChange={handleImageChange} />

            </Grid>
            <Grid item xs={12}>
            {formData.images}
            </Grid>

            {/* WhatsApp Number */}
            <Grid item xs={12}>
              <TextField fullWidth label="WhatsApp Number" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} required />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Update Property"}
              </Button>
              <Button variant="outlined" color="default" onClick={() => navigate("/admin/properties")}>
              Go Back
            </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
  );
};

export default UpdatePropertyPage;
