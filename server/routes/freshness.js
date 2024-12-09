import express from 'express';
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import Freshness from '../models/Freshness.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Prepare the form data
    const formData = new FormData();
    formData.append("file", fs.createReadStream(image.path));

    // Call Roboflow API
    const response = await axios.post(process.env.ROBOFLOW_MODEL_URL, formData, {
      params: {
        api_key: process.env.ROBOFLOW_API_KEY,
      },
      headers: {
        ...formData.getHeaders(), // Automatically sets the proper Content-Type header with boundary
      },
    });

    // Extract predictions from the response
    const predictions = response.data.predictions;
    if (!predictions || predictions.length === 0) {
      return res.status(400).json({ error: "No predictions received from Roboflow" });
    }

    // Calculate the freshness score and lifespan
    const freshnessScore = predictions[0].confidence;
    let lifespan = Math.max(1, Math.round((1 - freshnessScore) * 10));
    lifespan = 30 - lifespan; // Adjust lifespan calculation as needed

    // Save the results to MongoDB
    const freshnessRecord = new Freshness({
      produce: "Banana", // Add logic to detect produce name if needed
      freshness: freshnessScore,
      lifespan,
      imagePath: image.path,
    });
    await freshnessRecord.save();

    // Send response back to the client
    res.status(200).json({
      freshness: freshnessScore,
      lifespan,
      record: { createdAt: new Date().toISOString() },
    });

    // Clean up the uploaded file after processing
    fs.unlinkSync(image.path);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Error processing image" });
  }
});

export default router;
