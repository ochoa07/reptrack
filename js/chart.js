// js/chart.js
import { workouts } from "./history.js";

let chartInstance = null;

export function updateChart() {
  const canvas = document.getElementById("progressChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (workouts.length === 0) {
    if (chartInstance) chartInstance.destroy();
    return;
  }

  const sorted = [...workouts].reverse();

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: sorted.map(w => w.date),
      datasets: [{
        label: "Weight Progress (lbs)",
        data: sorted.map(w => w.weight),
        borderColor: "#7b4cff",
        backgroundColor: "rgba(123,76,255,0.2)",
        fill: true,
        borderWidth: 3
      }]
    },
    options: { responsive: true }
  });
}
