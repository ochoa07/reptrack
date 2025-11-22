// js/main.js
import { saveWorkout, clearWorkouts, displayWorkouts } from "./history.js";
import { updateChart } from "./chart.js";
import { updateStreak } from "./streak.js";
import { initSearch } from "./search.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".workout-form form");
  const historyList = document.getElementById("historyList");
  const clearBtn = document.getElementById("clearHistoryBtn");

  initSearch();
  displayWorkouts(historyList);
  updateChart();
  updateStreak();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const workout = {
      exercise: document.getElementById("exerciseSearch").value,
      weight: document.getElementById("weight").value,
      reps: document.getElementById("reps").value,
      sets: document.getElementById("sets").value,
      date: new Date().toISOString().split("T")[0]
    };

    saveWorkout(workout);
    displayWorkouts(historyList);
    updateChart();
    updateStreak();
    form.reset();
  });

  clearBtn.addEventListener("click", () => {
    clearWorkouts();
    displayWorkouts(historyList);
    updateChart();
    updateStreak();
  });
});