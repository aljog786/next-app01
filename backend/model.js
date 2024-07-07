import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  title: String,
  slug: String,
  image: String,
  summary: String,
  instructions: String,
  creator: String,
  creator_email: String,
});

export default mongoose.model('Meal', MealSchema);