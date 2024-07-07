import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import Meal from './model.js';

const app = express();
const port = 5500; // Use a different port than the Next.js server
app.use(cors());
const uri = 'mongodb+srv://aljog786:alb78Re6t@njscluster.fcmkkug.mongodb.net/nextlevel';

mongoose.connect(uri,)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

  app.use(bodyParser.json()); // To parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/meals', async (req, res) => {
    try {
      const meals = await Meal.find();
      res.json(meals);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
      res.status(500).json({ error: 'Failed to fetch meals' });
    }
  });


  app.get('/meals/:slug', async (req, res) => {
    try {
      const meal = await Meal.findOne({slug: req.params.slug});
      if (!meal) {
        return res.status(404).json({ error: 'Meal not found' });
      }
      res.json(meal);
    } catch (error) {
      console.error('Failed to fetch meal:', error);
      res.status(500).json({ error: 'Failed to fetch meal' });
    }
  });

  app.post('/meals', async (req, res) => {
    try {
        const newMeal = new Meal(req.body);
        await newMeal.save();
        res.status(201).json(newMeal);
    } catch (error) {
        console.error('Failed to save meal:', error);
        res.status(500).json({ error: 'Failed to save meal' });
    }
});

app.listen(port,()=>{
    console.log(`server is running @ http://localhost:${port}`)
});