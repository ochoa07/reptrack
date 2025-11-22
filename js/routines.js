// routines.js  --- MODULE for routines.html
import { getExercisesByBodyPart, cleanExerciseName } from "./api.js";

// Auto-run when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setupGenerateButtons();
  handleURLParameters();
});

/* Setup Generate Workout Buttons */
function setupGenerateButtons() {
  const buttons = document.querySelectorAll(".generate-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const section = btn.dataset.section;
      const list = btn.previousElementSibling;

      let bodyPart = mapSectionToBodyPart(section);

      // Show loading
      list.innerHTML = `<li>🔄 Generating your new workout...</li>`;

      const exercises = await getExercisesByBodyPart(bodyPart);

      if (exercises.length > 0) {
        const randomSet = pickRandomExercises(exercises);

        list.innerHTML = randomSet
          .map((ex) => {
            return `
              <li>
                <strong>${cleanExerciseName(ex.name)}</strong><br>
                <span>${generateSetsReps()}</span>
              </li>`;
          })
          .join("");

        btn.innerText = "Workout Updated!";
        setTimeout(() => (btn.innerText = "Generate Workout"), 1500);
      } else {
        list.innerHTML = `<li> No exercises found. Try again later.</li>`;
      }
    });
  });
}

/*  Helpers */
function mapSectionToBodyPart(section) {
  if (section === "upper") return "chest";
  if (section === "lower") return Math.random() > 0.5 ? "upper legs" : "lower legs";
  if (section === "cardio") return "cardio";
  if (section === "abs") return "waist";
  return "chest";
}

function pickRandomExercises(data) {
  return [...data].sort(() => 0.5 - Math.random()).slice(0, 5);
}

function generateSetsReps() {
  const sets = Math.floor(Math.random() * 2) + 3; // 3–4 sets
  const reps = Math.floor(Math.random() * 5) + 8; // 8–12 reps
  return `${sets} sets × ${reps} reps`;
}

/* URL Parameter Handling */
function handleURLParameters() {
  const params = new URLSearchParams(window.location.search);
  const routine = params.get("routine"); // e.g., ?routine=upper

  if (!routine) return;

  const section = document.getElementById(routine);
  if (!section) return;

  // Auto-scroll
  section.scrollIntoView({ behavior: "smooth", block: "center" });

  // Auto-generate workout
  const btn = section.querySelector(".generate-btn");
  if (btn) btn.click();
}