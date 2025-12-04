// js/dropdown.js
export function initDropdown() {
  const dropdown = document.querySelector(".dropdown");
  const menu = document.querySelector(".dropdown-menu");

  if (!dropdown || !menu) return;

  // Toggle dropdown on click
  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    menu.style.display = "none";
  });
}