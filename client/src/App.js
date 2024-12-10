import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
    setResult(null); // Reset the result when a new image is uploaded
  };

  const formatTimestamp = (isoTimestamp) => {
    const date = new Date(isoTimestamp);
    const isoString = date.toISOString().slice(0, 19); // Remove milliseconds and 'Z'
    return `${isoString}+05:30`;
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
      const response = await axios.post('http://localhost:5000', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response data:", response.data);

      const { freshness, lifespan, record } = response.data;

      setResult({
        freshness: freshness.toFixed(2),
        lifespan,
        timestamp: formatTimestamp(record.createdAt),
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
          <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "50%" }}>
            <thead>
              <tr>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Freshness Score</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Timestamp</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Estimated Lifespan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{result.freshness}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{result.timestamp}</td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{result.lifespan} days</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
