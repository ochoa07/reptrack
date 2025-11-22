// js/search.js
import { searchExercises } from "./api.js";

export function initSearch() {
  const input = document.getElementById("exerciseSearch");
  const results = document.getElementById("exerciseResults");
  if (!input || !results) return;

  let timer;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    const text = input.value.trim();
    if (text.length < 2) {
      results.innerHTML = "";
      return;
    }
    timer = setTimeout(async () => {
      const matches = await searchExercises(text);
      results.innerHTML = matches
        .slice(0, 10)
        .map(ex => `<li>${capitalize(ex.name)}</li>`)
        .join("");

      results.querySelectorAll("li").forEach(li => {
        li.addEventListener("click", () => {
          input.value = li.textContent;
          results.innerHTML = "";
        });
      });
    }, 400);
  });
}

function capitalize(str) {
  return str
    .split(" ")
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}