import { searchExercises } from "./api.js";

export function initSearch() {
  const input = document.getElementById("exerciseSearch");
  const results = document.getElementById("exerciseResults");

  if (!input || !results) return;

  let timer;
  let activeIndex = -1;
  let requestNumber = 0;

  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-controls", "exerciseResults");
  input.setAttribute("aria-expanded", "false");
  results.setAttribute("role", "listbox");

  input.addEventListener("input", handleInput);
  input.addEventListener("keydown", handleKeydown);

  document.addEventListener("click", (event) => {
    if (event.target !== input && !results.contains(event.target)) {
      closeResults();
    }
  });

  function handleInput() {
    window.clearTimeout(timer);
    activeIndex = -1;

    const query = input.value.trim();

    if (query.length < 2) {
      closeResults();
      return;
    }

    showStatus("Searching exercises…", "loading");

    timer = window.setTimeout(() => loadResults(query), 350);
  }

  async function loadResults(query) {
    const currentRequest = ++requestNumber;

    try {
      const matches = await searchExercises(query);

      // Ignore a response if the user has already started a newer search.
      if (currentRequest !== requestNumber || input.value.trim() !== query) {
        return;
      }

      renderResults(Array.isArray(matches) ? matches.slice(0, 8) : []);
    } catch {
      if (currentRequest === requestNumber) {
        showStatus("Exercises could not be loaded. Please try again.", "error");
      }
    }
  }

  function renderResults(matches) {
    results.replaceChildren();
    activeIndex = -1;

    if (matches.length === 0) {
      showStatus("No matching exercises found.", "empty");
      return;
    }

    matches.forEach((exercise, index) => {
      const option = document.createElement("li");
      option.id = `exercise-option-${index}`;
      option.className = "exercise-option";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      option.tabIndex = -1;

      const name = document.createElement("strong");
      name.textContent = capitalize(exercise.name || "Exercise");

      const action = document.createElement("span");
      action.textContent = "Select";

      option.append(name, action);
      option.addEventListener("click", () => selectOption(option));
      results.appendChild(option);
    });

    openResults();
  }

  function handleKeydown(event) {
    const options = [...results.querySelectorAll(".exercise-option")];

    if (event.key === "Escape") {
      closeResults();
      return;
    }

    if (!options.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = (activeIndex + 1) % options.length;
      highlightOption(options);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + options.length) % options.length;
      highlightOption(options);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectOption(options[activeIndex]);
    }
  }

  function highlightOption(options) {
    options.forEach((option, index) => {
      const isActive = index === activeIndex;
      option.classList.toggle("active", isActive);
      option.setAttribute("aria-selected", String(isActive));
    });

    const activeOption = options[activeIndex];
    input.setAttribute("aria-activedescendant", activeOption.id);
    activeOption.scrollIntoView({ block: "nearest" });
  }

  function selectOption(option) {
    input.value =
      option.querySelector("strong")?.textContent || option.textContent;
    closeResults();
    input.focus();
  }

  function showStatus(message, type) {
    results.replaceChildren();

    const status = document.createElement("li");
    status.className = `search-status ${type}`;
    status.textContent = message;
    status.setAttribute("role", "status");
    results.appendChild(status);

    openResults();
  }

  function openResults() {
    results.classList.add("open");
    input.setAttribute("aria-expanded", "true");
  }

  function closeResults() {
    results.classList.remove("open");
    results.replaceChildren();
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
  }
}

function capitalize(text) {
  return text
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function capitalize(str) {
  return str
    .split(" ")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}