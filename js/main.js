// js/main.js
import { saveWorkout, clearWorkouts, displayWorkouts } from "./history.js";
import { updateChart } from "./chart.js";
import { updateStreak } from "./streak.js";
import { initSearch } from "./search.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".workout-form form");
  const historyList = document.getElementById("historyList");
  const clearBtn = document.getElementById("clearHistoryBtn");
  const messageBox = document.getElementById("formMessage");
  const toast = document.getElementById("toast");

  initSearch();
  displayWorkouts(historyList);
  updateChart();
  updateStreak();

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

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const exercise = document.getElementById("exerciseSearch").value.trim();
    const weightValue = Number(document.getElementById("weight").value);
    const repsValue = Number(document.getElementById("reps").value);
    const setsValue = Number(document.getElementById("sets").value);

    // Basic validation
    if (!exercise) {
      showFormMessage("Please choose an exercise.", "error");
      return;
    }

    if (!Number.isFinite(weightValue) || weightValue <= 0) {
      showFormMessage("Please enter a weight greater than 0.", "error");
      return;
    }

    if (!Number.isFinite(repsValue) || repsValue <= 0) {
      showFormMessage("Reps must be at least 1.", "error");
      return;
    }

    if (!Number.isFinite(setsValue) || setsValue <= 0) {
      showFormMessage("Sets must be at least 1.", "error");
      return;
    }

    clearFormMessage();

    const workout = {
      exercise,
      weight: weightValue,
      reps: repsValue,
      sets: setsValue,
      date: new Date().toISOString().split("T")[0],
    };

    saveWorkout(workout);
    displayWorkouts(historyList);
    updateChart();
    updateStreak();
    form.reset();

    showToast("Workout added to history 🎉");
  });

  clearBtn.addEventListener("click", () => {
    clearWorkouts();
    displayWorkouts(historyList);
    updateChart();
    updateStreak();
    showToast("Workout history cleared.");
  });


});

