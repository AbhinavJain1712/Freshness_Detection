import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Router from './routes/route.js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Middleware
app.use(cors(
  {
        origin: ["https://strong-haupia-17583a.netlify.app/"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
connectDb();

// app.get('/', (req, res) => {
//   res.json({ msg: 'Welcome to the Freshness Detection API' });
// });


//Routes
app.use('/', Router);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
