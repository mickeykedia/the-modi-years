const themeButtons = [...document.querySelectorAll("[data-theme-filter]")];
const termButtons = [...document.querySelectorAll("[data-term-filter]")];
const scoreButtons = [...document.querySelectorAll("[data-score-filter]")];
const cards = [...document.querySelectorAll("[data-action-card]")];
const search = document.querySelector("[data-search-input]");
const empty = document.querySelector("[data-empty]");
let activeTheme = "all";
let activeTerm = "all";
let activeScore = "all";

function applyFilters() {
  const query = (search?.value || "").trim().toLowerCase();
  let visible = 0;
  for (const card of cards) {
    const themeMatch = activeTheme === "all" || card.dataset.theme === activeTheme;
    const termMatch = activeTerm === "all" || card.dataset.term === activeTerm;
    const scoreMatch = activeScore === "all" || card.dataset.score === activeScore;
    const searchMatch = !query || (card.dataset.search || "").includes(query);
    const show = themeMatch && termMatch && scoreMatch && searchMatch;
    card.hidden = !show;
    if (show) visible += 1;
  }
  if (empty) empty.hidden = visible !== 0;
}

function selectFilter(buttons, selected, update) {
  update(selected);
  for (const item of buttons) {
    const isActive = item === selected;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  }
  applyFilters();
}

for (const button of themeButtons) button.addEventListener("click", () => selectFilter(themeButtons, button, (item) => { activeTheme = item.dataset.themeFilter || "all"; }));
for (const button of termButtons) button.addEventListener("click", () => selectFilter(termButtons, button, (item) => { activeTerm = item.dataset.termFilter || "all"; }));
for (const button of scoreButtons) button.addEventListener("click", () => selectFilter(scoreButtons, button, (item) => { activeScore = item.dataset.scoreFilter || "all"; }));

search?.addEventListener("input", applyFilters);

document.querySelector("[data-clear]")?.addEventListener("click", () => {
  activeTheme = "all";
  activeTerm = "all";
  activeScore = "all";
  if (search) search.value = "";
  for (const group of [themeButtons, termButtons, scoreButtons]) {
    for (const item of group) {
      const isActive = item.dataset.themeFilter === "all" || item.dataset.termFilter === "all" || item.dataset.scoreFilter === "all";
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    }
  }
  applyFilters();
});
