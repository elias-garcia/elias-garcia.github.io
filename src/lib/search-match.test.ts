import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fold,
  markMatches,
  markStart,
  matches,
  words,
} from "./search-match.ts";

test("fold lowers case and drops accents", () => {
  assert.equal(fold("Résumé CAFÉ").folded, "resume cafe");
});

test("fold gives every unit of the folded text its character's place", () => {
  const { folded, positions } = fold("🚀 Go");
  assert.equal(positions.length, folded.length);
  assert.deepEqual(positions, [0, 0, 1, 2, 3]);
});

test("words splits a query on spaces and ignores the extra ones", () => {
  assert.deepEqual(words("  Daily   Report "), ["daily", "report"]);
  assert.deepEqual(words("   "), []);
});

test("a term matches at the start of a word only", () => {
  assert.equal(matches("Notes on AI tools", ["ai"]), true);
  assert.equal(matches("A daily report", ["ai"]), false);
  assert.equal(matches("Plain markdown notes", ["mark"]), true);
});

test("every term has to match", () => {
  assert.equal(matches("A daily report", ["daily", "report"]), true);
  assert.equal(matches("A daily report", ["daily", "tools"]), false);
});

test("an empty term matches nothing and marks nothing", () => {
  assert.equal(matches("A daily report", [""]), false);
  assert.deepEqual(markMatches("A daily report", [""]), [
    { text: "A daily report", marked: false },
  ]);
  assert.deepEqual(markStart("A daily report", ""), [
    { text: "A daily report", marked: false },
  ]);
});

test("matching ignores accents on both sides", () => {
  assert.equal(matches("Résumé café", words("cafe")), true);
});

test("markMatches marks each matching word start", () => {
  assert.deepEqual(markMatches("Tools that make tool lists", ["tool"]), [
    { text: "Tool", marked: true },
    { text: "s that make ", marked: false },
    { text: "tool", marked: true },
    { text: " lists", marked: false },
  ]);
});

test("markMatches keeps the original spelling of what it marks", () => {
  assert.deepEqual(markMatches("Résumé", ["res"]), [
    { text: "Rés", marked: true },
    { text: "umé", marked: false },
  ]);
});

test("markMatches joins marks that touch and leaves the rest whole", () => {
  assert.deepEqual(markMatches("No match here", ["zzz"]), [
    { text: "No match here", marked: false },
  ]);
  assert.deepEqual(markMatches("tool", ["tool", "to"]), [
    { text: "tool", marked: true },
  ]);
});

test("markMatches marks the right letters after an emoji", () => {
  assert.deepEqual(markMatches("🚀 Launch day", ["la"]), [
    { text: "🚀 ", marked: false },
    { text: "La", marked: true },
    { text: "unch day", marked: false },
  ]);
});

test("markStart marks the start of a text that starts with the term", () => {
  assert.deepEqual(markStart("Markdown", "mark"), [
    { text: "Mark", marked: true },
    { text: "down", marked: false },
  ]);
  assert.deepEqual(markStart("PDF", "pdf"), [{ text: "PDF", marked: true }]);
});

test("markStart leaves a text that doesn't start with the term", () => {
  assert.deepEqual(markStart("Markdown", "down"), [
    { text: "Markdown", marked: false },
  ]);
});
