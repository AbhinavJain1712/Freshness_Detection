import express from 'express';
import multer from 'multer';
import freshness from './freshness.js';

const router = express.Router();

// Configure Multer with memory storage (better for platforms without persistent file storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add routes
router.get('/', (req, res) => {
  res.json("Hello, your backend is running!");
});

router.post('/', upload.single('image'), freshness);

export default router;
