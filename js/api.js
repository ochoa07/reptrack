// js/api.js
import { API_KEY, API_HOST } from "./config.js";

/* Fetch exercises from ExerciseDB API */
export async function getExercisesByBodyPart(bodyPart) {
  const url = `https://${API_HOST}/exercises/bodyPart/${bodyPart}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,    // from config.js
      "x-rapidapi-host": API_HOST,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(" ExerciseDB API error:", err);
    return []; // prevent app crash
  }
}

/* Clean exercise names (remove equipment words) */
export function cleanExerciseName(name) {
  return name
    .replace(
      /\b(barbell|dumbbell|machine|band|smith|weighted|bodyweight|cable|lever|kettlebell)\b/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

/* Search API for main page exercise search bar */
export async function searchExercises(query) {
  const url = "https://exercisedb.p.rapidapi.com/exercises";

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": API_HOST,
    },
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    return data.filter((ex) =>
      ex.name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (err) {
    console.error(" Error searching exercises:", err);
    return [];
  }
}