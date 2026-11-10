import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "dist");
const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
const actions = JSON.parse(readFileSync(resolve(root, "content/actions.json"), "utf8"));
const themes = JSON.parse(readFileSync(resolve(root, "content/themes.json"), "utf8"));
const terms = JSON.parse(readFileSync(resolve(root, "content/terms.json"), "utf8"));

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

const scoreClass = (score) => score === -2 ? "score-n2" : score === -1 ? "score-n1" : score === 1 ? "score-p1" : score === 2 ? "score-p2" : "score-zero";
const scoreLabel = (score) => ({ "-2": "harmful", "-1": "more bad", "0": "unjudged", "1": "more good", "2": "beneficial" })[String(score)];
const scoreText = (score) => `${score > 0 ? "+" : ""}${score}`;
const termForDate = (date) => terms.find((term) => date >= term.starts && date < term.ends)?.id || "unknown";

function layout({ title, description, body, depth = 0, script = false, socialImage = false }) {
  const prefix = "../".repeat(depth);
  const social = socialImage && siteUrl ? `
  <meta property="og:image" content="${escapeHtml(siteUrl)}/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${escapeHtml(siteUrl)}/og.png">` : `
  <meta name="twitter:card" content="summary">`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">${social}
  <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${prefix}assets/styles.css">
</head>
<body>${body}${script ? `<script src="${prefix}assets/app.js" defer></script>` : ""}</body>
</html>`;
}

function header({ depth = 0, detail = false } = {}) {
  const home = "../".repeat(depth) || "./";
  return `<header class="site-header${detail ? " detail-header" : ""}">
    <a class="wordmark" href="${home}" aria-label="NDA Record home"><span class="wordmark-mark" aria-hidden="true"></span> NDA Record</a>
    ${detail ? `<a href="${home}#record">← All actions</a>` : `<nav aria-label="Primary navigation"><a href="#record">Browse the record</a></nav>`}
  </header>`;
}

function homePage() {
  const positive = actions.filter((action) => action.judgement.score > 0).length;
  const negative = actions.filter((action) => action.judgement.score < 0).length;
  const themeButtons = themes.map((theme) => `<button type="button" aria-pressed="false" data-theme-filter="${escapeHtml(theme.id)}">${escapeHtml(theme.label)} <span>${actions.filter((action) => action.theme === theme.id).length}</span></button>`).join("");
  const termButtons = terms.map((term) => `<button type="button" aria-pressed="false" data-term-filter="${escapeHtml(term.id)}">${escapeHtml(term.label)} <small>${escapeHtml(term.years)}</small> <span>${actions.filter((action) => termForDate(action.date) === term.id).length}</span></button>`).join("");
  const judgementButtons = [-2, -1, 0, 1, 2].map((score) => `<button type="button" aria-pressed="false" data-score-filter="${score}">${scoreText(score)} ${scoreLabel(score)} <span>${actions.filter((action) => action.judgement.score === score).length}</span></button>`).join("");
  const cards = actions.map((action) => {
    const theme = themes.find((item) => item.id === action.theme);
    const searchable = [action.title, action.summary, ...action.tags].join(" ").toLowerCase();
    return `<a class="action-card ${scoreClass(action.judgement.score)} size-${action.significance}" data-action-card data-theme="${escapeHtml(action.theme)}" data-term="${termForDate(action.date)}" data-score="${action.judgement.score}" data-search="${escapeHtml(searchable)}" href="./actions/${escapeHtml(action.slug)}/">
      <div class="card-meta"><span>${escapeHtml(theme?.label)}</span><span>${escapeHtml(action.date.slice(0,4))}</span></div>
      <h3>${escapeHtml(action.title)}</h3><p>${escapeHtml(action.summary)}</p>
      <div class="card-foot"><span class="verdict">${scoreText(action.judgement.score)} · ${scoreLabel(action.judgement.score)}</span><span class="arrow" aria-hidden="true">↗</span></div>
    </a>`;
  }).join("");

  const body = `<main>${header()}
    <section class="hero" id="top"><div class="hero-copy"><p class="eyebrow">India · NDA governments · 2014—present</p><h1>12+ years.<br><span>One public ledger.</span></h1><p class="lede">A structured, sourced record of consequential government actions—including the editor’s explicit judgement and the evidence behind it.</p><div class="hero-actions"><a class="button primary" href="#record">Explore the record ↓</a></div></div>
    <aside class="hero-ledger" aria-label="Prototype summary"><div class="ledger-heading"><span>Prototype ledger</span><span class="live-dot">Design v0.1</span></div><div class="ledger-grid"><div><strong>${actions.length}</strong><span>sample actions</span></div><div><strong>${themes.length}</strong><span>themes</span></div><div><strong class="positive-text">${positive}</strong><span>positive</span></div><div><strong class="negative-text">${negative}</strong><span>negative</span></div></div><p>Every published change is traceable to a source, rationale, reviewer and repository commit.</p></aside></section>
    <section class="prototype-note" aria-label="Research notice"><span>Research inventory</span><p>Newly collected actions are shown in grey as unjudged drafts. Existing coloured scores remain illustrative until the editor reviews the evidence and adopts a judgement.</p></section>
    <section class="record" id="record"><div class="section-heading"><div><p class="eyebrow">The action map</p><h2>Judge the action. Show the work.</h2></div><div class="legend" aria-label="Judgement scale"><span><i class="swatch score-n2"></i> Harmful</span><span><i class="swatch score-n1"></i> More bad</span><span><i class="swatch score-p1"></i> More good</span><span><i class="swatch score-p2"></i> Beneficial</span></div></div>
      <div class="controls"><div class="filter-stack">
        <div class="filter-row"><span class="filter-label">Term</span><div class="theme-tabs" role="group" aria-label="Filter by government term"><button class="active" aria-pressed="true" type="button" data-term-filter="all">All <span>${actions.length}</span></button>${termButtons}</div></div>
        <div class="filter-row"><span class="filter-label">Theme</span><div class="theme-tabs" role="group" aria-label="Filter by theme"><button class="active" aria-pressed="true" type="button" data-theme-filter="all">All <span>${actions.length}</span></button>${themeButtons}</div></div>
        <div class="filter-row"><span class="filter-label">Judgement</span><div class="theme-tabs" role="group" aria-label="Filter by judgement"><button class="active" aria-pressed="true" type="button" data-score-filter="all">All <span>${actions.length}</span></button>${judgementButtons}</div></div>
      </div><label class="search"><span class="sr-only">Search actions</span><input data-search-input placeholder="Search the record" type="search"><span aria-hidden="true">⌕</span></label></div>
      <div class="action-grid">${cards}<div class="empty-state" data-empty hidden><h3>No actions match that view.</h3><button type="button" data-clear>Clear filters</button></div></div>
    </section>
    <footer><div><span class="wordmark">NDA Record</span><p>An independent, open-source editorial project.</p></div><div><a href="./content/actions.json">Raw data</a><a href="./content/JUDGEMENTS.md">Judgement ledger</a></div></footer>
  </main>`;
  return layout({ title: "NDA Record — a public ledger of government action", description: "An evidence-led, auditable map of major actions by India's NDA governments since 2014.", body, script: true, socialImage: true });
}

function actionPage(action) {
  const theme = themes.find((item) => item.id === action.theme);
  const paragraphs = (items) => items.map((item) => `<p>${escapeHtml(item)}</p>`).join("");
  const sources = action.sources.length ? `<ol class="source-list">${action.sources.map((source) => `<li><a href="${escapeHtml(source.url)}" rel="noreferrer">${escapeHtml(source.title)} ↗</a><span>${escapeHtml(source.publisher)} · ${escapeHtml(source.sourceType)}</span></li>`).join("")}</ol>` : `<div class="source-pending"><strong>Source review pending</strong><p>This demonstration record cannot be promoted to “reviewed” until claim-level sources are attached.</p></div>`;
  const body = `<main class="detail-page">${header({ depth: 2, detail: true })}<article><div class="detail-hero"><div class="detail-intro"><div class="detail-kicker"><span>${escapeHtml(theme?.label)}</span><span>${escapeHtml(action.date)}</span><span>${escapeHtml(action.status)}</span></div><h1>${escapeHtml(action.title)}</h1><p>${escapeHtml(action.summary)}</p></div><aside class="judgement-card ${scoreClass(action.judgement.score)}"><span>Editor’s judgement</span><strong>${scoreText(action.judgement.score)}</strong><h2>${escapeHtml(action.judgement.label)}</h2><p>${scoreLabel(action.judgement.score)} · ${escapeHtml(action.judgement.confidence)} confidence</p><small>${action.judgement.score === 0 ? "Research inventory · judgement pending" : "Illustrative score · not yet reviewed"}</small></aside></div>
    <div class="detail-layout"><div class="detail-body"><section><p class="section-number">01 / Overview</p>${paragraphs(action.overview)}</section><section><p class="section-number">02 / What changed</p>${paragraphs(action.detail)}</section><section><p class="section-number">03 / Observed impact</p><ul class="impact-list">${action.impact.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section><section class="rationale-section"><p class="section-number">04 / Value judgement</p><h2>Why this score?</h2>${paragraphs(action.judgement.rationale)}<div class="values-row">${action.judgement.values.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div><div class="countercase"><h3>The strongest countercase</h3>${paragraphs(action.judgement.countercase)}</div></section><section><p class="section-number">05 / Sources</p>${sources}</section></div>
    <aside class="detail-rail"><div><span>Editorial status</span><strong>${escapeHtml(action.status)}</strong></div><div><span>Assessment</span><strong>${escapeHtml(action.judgement.assessedAt)}</strong></div><div><span>Change record</span><strong>${escapeHtml(action.changeId)}</strong></div><a href="../../content/JUDGEMENTS.md">Read judgement ledger ↗</a></aside></div></article></main>`;
  return layout({ title: `${action.title} · NDA Record`, description: action.summary, body, depth: 2 });
}

rmSync(out, { recursive: true, force: true });
mkdirSync(resolve(out, "assets"), { recursive: true });
mkdirSync(resolve(out, "content"), { recursive: true });
writeFileSync(resolve(out, "index.html"), homePage());
writeFileSync(resolve(out, "404.html"), layout({ title: "Page not found · NDA Record", description: "The requested page was not found.", body: `<main class="missing">${header()}<h1>Page not found</h1><p><a href="./">Return to the record</a></p></main>` }));
writeFileSync(resolve(out, ".nojekyll"), "");
cpSync(resolve(root, "app/globals.css"), resolve(out, "assets/styles.css"));
cpSync(resolve(root, "site/app.js"), resolve(out, "assets/app.js"));
cpSync(resolve(root, "public/favicon.svg"), resolve(out, "favicon.svg"));
cpSync(resolve(root, "public/og.png"), resolve(out, "og.png"));
cpSync(resolve(root, "content/actions.json"), resolve(out, "content/actions.json"));
cpSync(resolve(root, "content/themes.json"), resolve(out, "content/themes.json"));
cpSync(resolve(root, "content/terms.json"), resolve(out, "content/terms.json"));
cpSync(resolve(root, "content/JUDGEMENTS.md"), resolve(out, "content/JUDGEMENTS.md"));

for (const action of actions) {
  const directory = resolve(out, "actions", action.slug);
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, "index.html"), actionPage(action));
}

console.log(`Built ${actions.length + 2} pages in dist/`);
