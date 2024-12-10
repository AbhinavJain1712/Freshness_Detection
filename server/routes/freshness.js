import axios from 'axios';
import FormData from 'form-data';
import Freshness from '../models/Freshness.js';

const freshness = async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Prepare the form data for Roboflow
    const formData = new FormData();
    formData.append("file", image.buffer, image.originalname); // Using buffer for memory storage

    // Call Roboflow API
    const response = await axios.post(process.env.ROBOFLOW_MODEL_URL, formData, {
      params: {
        api_key: process.env.ROBOFLOW_API_KEY,
      },
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Handle predictions
    const predictions = response.data.predictions;
    if (!predictions || predictions.length === 0) {
      return res.status(400).json({ error: "No predictions received from Roboflow" });
    }

    const freshnessScore = predictions[0].confidence;
    let lifespan = predictions[0].class[4];
    if (predictions[0].class.length > 5) {
      lifespan += predictions[0].class[5];
    }
    lifespan = 30 - lifespan; // Adjust lifespan calculation as needed

    // Save to MongoDB
    const freshnessRecord = new Freshness({
      produce: "Banana", // Modify to detect dynamically if required
      freshness: freshnessScore,
      lifespan,
    });
    await freshnessRecord.save();

    // Respond to the client
    res.status(200).json({
      freshness: freshnessScore,
      lifespan,
      record: { createdAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Error processing image:", error.response?.data || error.message);
    res.status(500).json({ error: "Error processing image" });
  }
};

export default freshness;
