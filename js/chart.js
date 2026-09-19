import { workouts } from "./history.js";

let chartInstance = null;

export function updateChart() {
  const canvas = document.getElementById("progressChart");

  if (!canvas || typeof Chart === "undefined") return;

  const ctx = canvas.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (workouts.length === 0) return;

  const sorted = [...workouts].reverse();
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height || 270);
  gradient.addColorStop(0, "rgba(255, 92, 92, 0.34)");
  gradient.addColorStop(1, "rgba(255, 92, 92, 0.01)");

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: sorted.map((workout) => formatDate(workout.date)),
      datasets: [
        {
          label: "Weight Progress (lb)",
          data: sorted.map((workout) => Number(workout.weight)),
          borderColor: "#ff5c5c",
          backgroundColor: gradient,
          pointBackgroundColor: "#ff8585",
          pointBorderColor: "#111518",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3,
          tension: 0.38,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#171c20",
          titleColor: "#f5f7f6",
          bodyColor: "#f5f7f6",
          borderColor: "#343c41",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: (context) => `${context.parsed.y} lb`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            color: "rgba(146, 154, 154, 0.25)",
          },
          ticks: {
            color: "#929a9a",
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6,
          },
        },
        y: {
          beginAtZero: false,
          grid: {
            color: "rgba(146, 154, 154, 0.12)",
          },
          border: {
            display: false,
          },
          ticks: {
            color: "#929a9a",
            padding: 8,
          },
        },
      },
    },
  });
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
