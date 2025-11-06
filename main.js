document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".workout-form form");
  const historyList = document.querySelector(".history-list");
  const clearBtn = document.getElementById("clearHistoryBtn");

  // Load stored workouts from localStorage
  let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

  // Display workouts in history
  function displayWorkouts() {
    historyList.innerHTML = "";

    if (workouts.length === 0) {
      historyList.innerHTML = "<p>No workouts yet. Add one!</p>";
      return;
    }

    workouts.forEach((w) => {
      const item = document.createElement("div");
      item.classList.add("history-item");
      item.innerHTML = `
        <p class="date"><strong>${w.date}</strong></p>
        <p class="exercise">${w.exercise}</p>
        <p class="details">${w.weight} lbs × ${w.reps} reps × ${w.sets} sets</p>
      `;
      historyList.appendChild(item);
    });
  }

  // Update progress chart
  let chartInstance = null;
  function updateChart() {
    const ctx = document.getElementById("progressChart");
    if (!ctx) return;

    const chartCtx = ctx.getContext("2d");

    if (workouts.length === 0) {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      return;
    }

    const sorted = [...workouts].reverse();
    const labels = sorted.map((w) => w.date);
    const weights = sorted.map((w) => parseFloat(w.weight));

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(chartCtx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Weight Progress (lbs)",
            data: weights,
            borderColor: "#7b4cff",
            backgroundColor: "rgba(123, 76, 255, 0.2)",
            fill: true,
            borderWidth: 3,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: "#a37bff",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#555" } },
          y: { beginAtZero: false, ticks: { color: "#555" } },
        },
      },
    });
  }

  // Update streak dynamically
  function updateStreak() {
    const streakCount = document.getElementById("streakCount");
    if (!streakCount) return;

    if (workouts.length === 0) {
      streakCount.textContent = "0";
      return;
    }

    const uniqueDates = [...new Set(workouts.map((w) => w.date))];
    const sorted = uniqueDates.map((d) => new Date(d)).sort((a, b) => a - b);

    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diffDays = Math.round(
        (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) streak++;
      else if (diffDays > 1) streak = 1;
    }

    streakCount.textContent = streak;
  }

  // Floating message (replaces alert)
  function showMessage(text, type = "info") {
    const msg = document.createElement("div");
    msg.textContent = text;
    msg.style.position = "fixed";
    msg.style.top = "20px";
    msg.style.right = "20px";
    msg.style.padding = "10px 20px";
    msg.style.borderRadius = "10px";
    msg.style.color = "#fff";
    msg.style.fontWeight = "600";
    msg.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    msg.style.zIndex = "9999";
    msg.style.transition = "opacity 0.5s ease";
    msg.style.fontFamily = "'Inter', sans-serif";
    msg.style.background =
      type === "success"
        ? "linear-gradient(90deg,#7b4cff,#a37bff)"
        : type === "error"
        ? "#e74c3c"
        : "#555";

    document.body.appendChild(msg);
    setTimeout(() => {
      msg.style.opacity = "0";
      setTimeout(() => msg.remove(), 500);
    }, 2000);
  }

  // Initial load
  displayWorkouts();
  updateChart();
  updateStreak();

  // Add workout
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const exercise = document.getElementById("exerciseSearch")?.value.trim();
    const weight = document.getElementById("weight").value.trim();
    const reps = document.getElementById("reps").value.trim();
    const sets = document.getElementById("sets").value.trim();

    if (!exercise || !weight || !reps || !sets) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    const date = new Date().toISOString().split("T")[0]; // ISO for streaks
    const newWorkout = { exercise, weight, reps, sets, date };

    workouts.unshift(newWorkout);
    localStorage.setItem("workouts", JSON.stringify(workouts));

    displayWorkouts();
    updateChart();
    updateStreak();
    form.reset();
    showMessage("Workout saved successfully!", "success");
  });

  // Clear all workouts
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all workouts?")) {
        workouts = [];
        localStorage.removeItem("workouts");
        displayWorkouts();
        updateChart();
        updateStreak();
        showMessage("All workouts cleared.", "info");
      }
    });
  }
});