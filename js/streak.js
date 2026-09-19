import { workouts } from "./history.js";

export function updateStreak() {
  const streakCount = document.getElementById("streakCount");

  if (!streakCount) return;

  const workoutDates = new Set(
    workouts.map((workout) => workout.date).filter(Boolean),
  );

  if (workoutDates.size === 0) {
    streakCount.textContent = "0";
    return;
  }

  const cursor = startOfToday();

  // Keep the streak active until the end of today, even if today's workout
  // has not been logged yet.
  if (!workoutDates.has(toDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;

  while (workoutDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  streakCount.textContent = String(streak);
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
