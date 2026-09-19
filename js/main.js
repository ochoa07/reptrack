import { saveWorkout, clearWorkouts, displayWorkouts } from "./history.js";
import { updateChart } from "./chart.js";
import { updateStreak } from "./streak.js";
import { initSearch } from "./search.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("workoutForm");
  const historyList = document.getElementById("historyList");
  const clearButton = document.getElementById("clearHistoryBtn");
  const messageBox = document.getElementById("formMessage");
  const toast = document.getElementById("toast");

  initSearch();
  refreshPlanner();

  if (form) {
    form.addEventListener("submit", handleWorkoutSubmit);
    form.addEventListener("input", clearFormMessage);
  }

  if (clearButton) {
    clearButton.addEventListener("click", handleClearHistory);
  }

  function handleWorkoutSubmit(event) {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const workout = getWorkoutFromForm();
    const validationMessage = validateWorkout(workout);

    if (validationMessage) {
      showFormMessage(validationMessage, "error");
      return;
    }

    clearFormMessage();

    if (submitButton) submitButton.disabled = true;

    saveWorkout(workout);
    refreshPlanner();
    form.reset();

    showFormMessage("Workout saved successfully.", "success");
    showToast("Workout added — keep going!");

    if (submitButton) {
      setTimeout(() => {
        submitButton.disabled = false;
      }, 350);
    }
  }

  function handleClearHistory() {
    const hasWorkouts = historyList?.querySelector(".history-item");

    if (!hasWorkouts) {
      showToast("Your workout history is already empty.");
      return;
    }

    const shouldClear = window.confirm(
      "Clear your entire workout history? This cannot be undone.",
    );

    if (!shouldClear) return;

    clearWorkouts();
    refreshPlanner();
    clearFormMessage();
    showToast("Workout history cleared.");
  }

  function getWorkoutFromForm() {
    return {
      exercise: document.getElementById("exerciseSearch")?.value.trim() || "",
      weight: Number(document.getElementById("weight")?.value),
      reps: Number(document.getElementById("reps")?.value),
      sets: Number(document.getElementById("sets")?.value),
      date: getLocalDateKey(),
    };
  }

  function validateWorkout(workout) {
    if (!workout.exercise) return "Please choose an exercise.";
    if (!Number.isFinite(workout.weight) || workout.weight <= 0) {
      return "Please enter a weight greater than 0.";
    }
    if (!Number.isInteger(workout.reps) || workout.reps < 1) {
      return "Reps must be a whole number of at least 1.";
    }
    if (!Number.isInteger(workout.sets) || workout.sets < 1) {
      return "Sets must be a whole number of at least 1.";
    }

    return "";
  }

  function refreshPlanner() {
    displayWorkouts(historyList);
    updateChart();
    updateStreak();
  }

  function showFormMessage(text, type = "error") {
    if (!messageBox) return;

    messageBox.textContent = text;
    messageBox.classList.remove("error", "success");
    messageBox.classList.add(type);
  }

  function clearFormMessage() {
    if (!messageBox) return;

    messageBox.textContent = "";
    messageBox.classList.remove("error", "success");
  }

  let toastTimer;

  function showToast(text) {
    if (!toast) return;

    window.clearTimeout(toastTimer);
    toast.textContent = text;
    toast.classList.add("show");

    toastTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }
});

function getLocalDateKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
