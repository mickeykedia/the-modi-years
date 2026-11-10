import { readFileSync } from "node:fs";

const actions = JSON.parse(readFileSync(new URL("../content/actions.json", import.meta.url), "utf8"));
const themes = JSON.parse(readFileSync(new URL("../content/themes.json", import.meta.url), "utf8"));
const terms = JSON.parse(readFileSync(new URL("../content/terms.json", import.meta.url), "utf8"));
const themeIds = new Set(themes.map((theme) => theme.id));
const slugs = new Set();
const changeIds = new Set();
const errors = [];

for (const term of terms) {
  if (!/^term-\d+$/.test(term.id || "")) errors.push(`${term.id || "<missing term>"}: invalid term id`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(term.starts || "") || !/^\d{4}-\d{2}-\d{2}$/.test(term.ends || "")) errors.push(`${term.id}: term boundaries must be YYYY-MM-DD`);
  if (term.starts >= term.ends) errors.push(`${term.id}: term start must precede term end`);
}

for (const action of actions) {
  const at = action.slug || "<missing slug>";
  if (action.schemaVersion !== 1) errors.push(`${at}: schemaVersion must be 1`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(action.slug || "")) errors.push(`${at}: invalid slug`);
  if (slugs.has(action.slug)) errors.push(`${at}: duplicate slug`);
  slugs.add(action.slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(action.date || "")) errors.push(`${at}: date must be YYYY-MM-DD`);
  if (terms.filter((term) => action.date >= term.starts && action.date < term.ends).length !== 1) errors.push(`${at}: date must belong to exactly one configured term`);
  if (!themeIds.has(action.theme)) errors.push(`${at}: unknown theme ${action.theme}`);
  if (![-2, -1, 0, 1, 2].includes(action.judgement?.score)) errors.push(`${at}: score must be -2..2`);
  if (!["draft", "reviewed", "disputed"].includes(action.status)) errors.push(`${at}: invalid status`);
  if (!["small", "medium", "large"].includes(action.significance)) errors.push(`${at}: invalid significance`);
  if (action.status === "reviewed" && (!Array.isArray(action.sources) || action.sources.length === 0)) errors.push(`${at}: reviewed records require sources`);
  if (!Array.isArray(action.judgement?.rationale) || action.judgement.rationale.length === 0) errors.push(`${at}: rationale required`);
  if (!Array.isArray(action.judgement?.countercase) || action.judgement.countercase.length === 0) errors.push(`${at}: countercase required`);
  if (!action.changeId) errors.push(`${at}: changeId required`);
  if (changeIds.has(action.changeId)) errors.push(`${at}: duplicate changeId`);
  changeIds.add(action.changeId);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`OK: ${actions.length} actions across ${themes.length} themes and ${terms.length} terms`);
