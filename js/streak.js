// js/streak.js
import { workouts } from "./history.js";

export function updateStreak() {
  const streakCount = document.getElementById("streakCount");
  if (!streakCount) return;

  if (workouts.length === 0) {
    streakCount.textContent = "0";
    return;
  }

  const uniqueDates = [...new Set(workouts.map(w => w.date))];
  const sorted = uniqueDates.map(d => new Date(d)).sort((a, b) => a - b);

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else streak = 1;
  }

  streakCount.textContent = streak;
}