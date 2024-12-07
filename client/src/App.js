import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const formatTimestamp = (isoTimestamp) => {
    const timestamp = new Date(isoTimestamp);
    const timezoneOffset = timestamp.getTimezoneOffset();
    const offsetSign = timezoneOffset > 0 ? "-" : "+";
    const offsetHours = String(Math.abs(Math.floor(timezoneOffset / 60))).padStart(2, '0');
    const offsetMinutes = String(Math.abs(timezoneOffset % 60)).padStart(2, '0');
    return `${timestamp.toISOString().slice(0, -1)}${offsetSign}${5}:${offsetMinutes}`;
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    try {
      const response = await axios.post("https://freshness-detection-app.onrender.com", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response data:", response.data);

      // Extract the fields from the backend response
      const { freshness, lifespan, record } = response.data;
      

      setResult({
        freshness: freshness.toFixed(2), // Format the freshness score
        lifespan, // Lifespan is already rounded in the backend
        timestamp: formatTimestamp(record.createdAt), // Format the timestamp
      });
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "50px" }}>
      <h1>Freshness Detection App</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>Submit</button>
      {loading && <p>Processing...</p>}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Results:</h3>
          <p><strong>Freshness Score:</strong> {result.freshness}</p>
         <p><strong>Timestamp:</strong> {result.timestamp}</p>
          <p><strong>Estimated Lifespan:</strong>{result.lifespan} days</p>
        </div>
      )}
    </div>
  );
}

export default App;
