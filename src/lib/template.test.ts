import assert from "node:assert/strict";
import { test } from "node:test";
import { fill } from "./template.ts";

test("fill replaces every placeholder it has a value for", () => {
  assert.equal(
    fill("Photo {index} of {count}: {title}", {
      index: "2",
      count: "3",
      title: "A talk",
    }),
    "Photo 2 of 3: A talk",
  );
});

test("fill leaves a placeholder it has no value for", () => {
  assert.equal(
    fill("{page} · {name}", { page: "Writing" }),
    "Writing · {name}",
  );
});

test("fill doesn't read a value as a pattern", () => {
  assert.equal(
    fill("Suggest “{query}”", { query: "$& $1" }),
    "Suggest “$& $1”",
  );
});
