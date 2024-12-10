import express from 'express';
import freshness from './freshness.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get("/", (req, res) => {
    res.json("Hello");
})

router.post('/', upload.single('image'),freshness);

export default router;