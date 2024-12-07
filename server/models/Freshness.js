import mongoose from 'mongoose';

const FreshnessSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  produce: String,
  freshness: Number,
  lifespan: Number,
  imagePath: String,
});

const Freshness = mongoose.model('Freshness', FreshnessSchema);

export default Freshness;
