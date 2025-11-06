// --- ExerciseDB API connection for RepTrack ---
const API_HOST = "exercisedb.p.rapidapi.com";

// Fetch exercises from the ExerciseDB API
async function getExercisesByBodyPart(bodyPart) {
  const url = `https://${API_HOST}/exercises/bodyPart/${bodyPart}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": API_KEY,
      "x-rapidapi-host": API_HOST,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API error:", error);
    return [];
  }
}

// --- Attach to "Generate Workout" buttons ---
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".generate-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const section = btn.dataset.section;
      const list = btn.previousElementSibling;
      let bodyPart = "chest"; // default

      // Correct API body part mapping
      if (section === "upper") bodyPart = "chest";
      if (section === "lower")
        bodyPart = Math.random() > 0.5 ? "upper legs" : "lower legs";
      if (section === "cardio") bodyPart = "cardio";
      if (section === "abs") bodyPart = "waist";

      // Show loading message
      list.innerHTML = `<li>🔄 Generating your new workout...</li>`;

      const exercises = await getExercisesByBodyPart(bodyPart);

      if (exercises.length > 0) {
        const randomSet = exercises.sort(() => 0.5 - Math.random()).slice(0, 5);

        // Random sets/reps generator
        const generateSetsReps = () => {
          const sets = Math.floor(Math.random() * 2) + 3; // 3–4 sets
          const reps = Math.floor(Math.random() * 5) + 8; // 8–12 reps
          return `${sets} sets × ${reps} reps`;
        };

        // Display clean version (only name + sets/reps)
        list.innerHTML = randomSet
          .map(
            (ex) => `
              <li>
                <strong>${cleanExerciseName(ex.name)}</strong><br>
                <span>${generateSetsReps()}</span>
              </li>`
          )
          .join("");

        // Add subtle confirmation animation
        btn.innerText = "Workout Updated!";
        setTimeout(() => (btn.innerText = "Generate Workout"), 1500);
      } else {
        list.innerHTML = `<li>No exercises found. Try again later.</li>`;
      }
    });
  });
});

// --- Helper: Clean up redundant words in exercise names ---
function cleanExerciseName(name) {
  // Remove equipment & extra words
  return name
    .replace(
      /\b(barbell|dumbbell|machine|band|smith|weighted|bodyweight|cable|lever)\b/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("exerciseSearch");
  const resultsList = document.getElementById("exerciseResults");
  if (!input || !resultsList) return;

  let typingTimer;
  const typingDelay = 400; // ms delay after typing stops

  input.addEventListener("input", () => {
    clearTimeout(typingTimer);
    const query = input.value.trim();
    if (query.length < 2) {
      resultsList.innerHTML = "";
      return;
    }
    typingTimer = setTimeout(() => fetchExercises(query), typingDelay);
  });

  async function fetchExercises(query) {
    try {
      const url = "https://exercisedb.p.rapidapi.com/exercises";
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
        }
      };
      const res = await fetch(url, options);
      const data = await res.json();

      // Filter results that match the search
      const filtered = data.filter(ex =>
        ex.name.toLowerCase().includes(query.toLowerCase())
      );

      // Limit results to 10 for performance
      const topResults = filtered.slice(0, 10);

      // Display results
      resultsList.innerHTML = topResults
        .map(ex => `<li>${capitalize(ex.name)}</li>`)
        .join("");

      // Allow clicking on an exercise
      resultsList.querySelectorAll("li").forEach(li => {
        li.addEventListener("click", () => {
          input.value = li.textContent;
          resultsList.innerHTML = "";
        });
      });
    } catch (err) {
      console.error("Error fetching exercises:", err);
    }
  }

  function capitalize(str) {
    return str
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
});