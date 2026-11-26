import assert from "node:assert/strict";
import { test } from "node:test";
import { formatEntryDate, formatEntryRange } from "./format.ts";

test("formatEntryDate shows a year alone, and a month with its year", () => {
  assert.equal(formatEntryDate("2026"), "2026");
  assert.equal(formatEntryDate("2024-01"), "Jan 2024");
  assert.equal(formatEntryDate("2023-12"), "Dec 2023");
});

test("formatEntryRange ends an open range with the word given", () => {
  assert.equal(
    formatEntryRange({ start: "2020", end: "2024" }, "Now"),
    "2020 – 2024",
  );
  assert.equal(
    formatEntryRange({ start: "2024", end: "now" }, "Now"),
    "2024 – Now",
  );
  assert.equal(
    formatEntryRange({ start: "2023-07", end: "2024-01" }, "Now"),
    "Jul 2023 – Jan 2024",
  );
});
