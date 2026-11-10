import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const home = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const detail = readFileSync(new URL("../dist/actions/demonetisation-2016/index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../dist/assets/styles.css", import.meta.url), "utf8");
const actions = JSON.parse(readFileSync(new URL("../content/actions.json", import.meta.url), "utf8"));

test("homepage contains the action map and prototype warning", () => {
  assert.match(home, /The action map/);
  assert.match(home, /illustrative design data/);
  assert.match(home, /data-action-card/);
  assert.match(home, /<meta property="og:image" content="https:\/\/[^\"]+\/og\.png">/);
  assert.doesNotMatch(home, /Editorial method/);
  assert.doesNotMatch(home, /Private editorial workflow/);
  assert.doesNotMatch(home, /Hermes/);
});

test("detail page has record-specific metadata and editorial sections", () => {
  assert.match(detail, /<title>Demonetisation · NDA Record<\/title>/);
  assert.match(detail, /04 \/ Value judgement/);
  assert.match(detail, /05 \/ Sources/);
  assert.doesNotMatch(detail, /og\.png/);
  assert.match(detail, /twitter:description/);
});

test("every action has a generated detail page and homepage link", () => {
  for (const action of actions) {
    assert.ok(existsSync(new URL(`../dist/actions/${action.slug}/index.html`, import.meta.url)), action.slug);
    assert.match(home, new RegExp(`href="\\./actions/${action.slug}/"`));
  }
});

test("mobile layout keeps controls touchable and content within the viewport", () => {
  assert.match(home, /name="viewport" content="width=device-width,initial-scale=1"/);
  assert.match(styles, /@media \(max-width: 620px\)/);
  assert.match(styles, /\.theme-tabs \{[^}]*overflow-x: auto/s);
  assert.match(styles, /\.theme-tabs button \{[^}]*flex: 0 0 auto/s);
  assert.match(styles, /\.action-card[^}]*grid-column: span 12/s);
  assert.match(styles, /\.detail-intro h1 \{[^}]*overflow-wrap: anywhere/s);
  assert.match(styles, /\.theme-tabs button \{ min-height: 44px/);
  assert.match(styles, /\.search input \{[^}]*font-size: 16px/s);
  assert.ok(!existsSync(new URL("../dist/editorial", import.meta.url)));
});

test("homepage exposes combinable term, theme and judgement filters", () => {
  assert.match(home, /data-term-filter="term-1">1st term <small>2014–19<\/small>/);
  assert.match(home, /data-term-filter="term-2">2nd term <small>2019–24<\/small>/);
  assert.match(home, /data-term-filter="term-3">3rd term <small>2024–<\/small>/);
  assert.match(home, /data-theme-filter="economy"/);
  assert.match(home, /data-score-filter="-2"/);
  assert.match(home, /data-action-card[^>]*data-term="term-1"[^>]*data-score="/);
});
