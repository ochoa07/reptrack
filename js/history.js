// js/history.js
export let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

export function saveWorkout(w) {
  workouts.unshift(w);
  localStorage.setItem("workouts", JSON.stringify(workouts));
}

export function clearWorkouts() {
  workouts = [];
  localStorage.removeItem("workouts");
}

export function displayWorkouts(container) {
  if (!container) return;

  container.innerHTML = "";

  if (workouts.length === 0) {
    container.innerHTML = "<p>No workouts yet. Add one!</p>";
    return;
  }

  workouts.forEach(w => {
    container.innerHTML += `
      <div class="history-item">
        <p class="date"><strong>${w.date}</strong></p>
        <p class="exercise">${w.exercise}</p>
        <p class="details">${w.weight} lbs × ${w.reps} reps × ${w.sets} sets</p>
      </div>
    `;
  });
}