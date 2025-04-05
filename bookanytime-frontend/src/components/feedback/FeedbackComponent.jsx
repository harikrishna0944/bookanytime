import React, { useState } from "react";
import axios from "axios";

const FeedbackComponent = () => {
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !description.trim()) {
      alert("User not found or feedback is empty.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/feedback`, {
        username: user.fullName,
        email: user.email,
        phone: user.phoneNumber, // phone now included
        description: description.trim(),
      });

      alert("Feedback submitted successfully!");
      setDescription("");
    } catch (err) {
      console.error("Error submitting feedback", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Feedback for Property or Website
        </h2>
      <textarea
          className="w-full h-40 p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        placeholder="Write your feedback here..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
        onClick={handleSubmit}
      >
        Submit
      </button>
      </div>
    </div>
  );
};

export default FeedbackComponent;
