import fs from 'node:fs';
import slugify from 'slugify';
import xss from 'xss';
import Meal from '../../backend/model'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMeals() {
  await delay(2000);

  const res = await fetch('http://localhost:5500/meals');
  if (!res.ok) {
    throw new Error('Failed to fetch meals');
  }
  const meals = await res.json();
  console.log(meals); // Add this line to check the data
  return meals;
}

export async function getMeal(slug) {
  await delay(2000);

  const res = await fetch(`http://localhost:5500/meals/${slug}`);
  if (!res.ok) {
    throw new Error('Failed to fetch meal');
  }
  const meal = await res.json();
  console.log(meal); // Add this line to check the data
  return meal;
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();

  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error('Saving image failed!!!');
    }
  });
  meal.image = `/images/${fileName}`;

  const response = await fetch('http://localhost:5500/meals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meal)
  });

  if (!response.ok) {
    throw new Error('Failed to save meal');
  }

  const newMeal = await response.json();
  console.log(newMeal); // Add this line to check the data
  return newMeal;
}
