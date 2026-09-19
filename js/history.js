export let workouts = loadWorkouts();

export function saveWorkout(workout) {
  workouts.unshift(workout);
  localStorage.setItem("workouts", JSON.stringify(workouts));
}

export function clearWorkouts() {
  workouts = [];
  localStorage.removeItem("workouts");
}

export function displayWorkouts(container) {
  if (!container) return;

  container.replaceChildren();

  if (workouts.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "history-empty";
    emptyState.innerHTML = `
      <span aria-hidden="true">＋</span>
      <div>
        <strong>No workouts yet</strong>
        <p>Log your first set to start tracking your progress.</p>
      </div>
    `;
    container.appendChild(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();

  workouts.forEach((workout, index) => {
    fragment.appendChild(createWorkoutRow(workout, index));
  });

  container.appendChild(fragment);
}

function createWorkoutRow(workout, index) {
  const row = document.createElement("article");
  row.className = "history-item";

  const exercise = document.createElement("div");
  exercise.className = "history-exercise";

  const icon = document.createElement("span");
  icon.className = "history-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "↗";

  const titleGroup = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = workout.exercise || "Workout";

  const date = document.createElement("p");
  date.className = "date";
  date.textContent = formatDate(workout.date);

  titleGroup.append(title, date);
  exercise.append(icon, titleGroup);

  const stats = document.createElement("div");
  stats.className = "history-stats";
  stats.append(
    createStat("Weight", `${workout.weight} lb`),
    createStat("Reps", workout.reps),
    createStat("Sets", workout.sets),
    createStat(
      "Volume",
      `${formatNumber(
        Number(workout.weight) * Number(workout.reps) * Number(workout.sets),
      )} lb`,
    ),
  );

  const count = document.createElement("span");
  count.className = "history-number";
  count.textContent = String(index + 1).padStart(2, "0");

  row.append(exercise, stats, count);
  return row;
}

function createStat(label, value) {
  const stat = document.createElement("div");
  const statLabel = document.createElement("span");
  const statValue = document.createElement("strong");

  statLabel.textContent = label;
  statValue.textContent = value;
  stat.append(statLabel, statValue);

  return stat;
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString || "Date unavailable";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toLocaleString() : "0";
}

function loadWorkouts() {
  try {
    const saved = JSON.parse(localStorage.getItem("workouts"));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
