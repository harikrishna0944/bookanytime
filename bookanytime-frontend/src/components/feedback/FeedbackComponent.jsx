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
        username: user.username,
        email: user.email,
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
    <div className="max-w-md mx-auto mt-10 p-4 shadow-lg rounded-lg bg-white">
      <h2 className="text-2xl font-bold mb-4">Feedback for Property or Website</h2>
      <textarea
        className="w-full h-40 p-2 border rounded mb-4"
        placeholder="Write your feedback here..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default FeedbackComponent;
