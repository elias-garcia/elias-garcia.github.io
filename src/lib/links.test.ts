import assert from "node:assert/strict";
import { test } from "node:test";
import { arrowTail, writtenAddress } from "./links.ts";

test("writtenAddress drops the scheme, www and a trailing slash", () => {
  assert.equal(
    writtenAddress("https://www.linkedin.com/in/someone/"),
    "linkedin.com/in/someone",
  );
});

test("writtenAddress writes a site's home as its domain", () => {
  assert.equal(writtenAddress("https://example.com"), "example.com");
});

test("writtenAddress keeps the path of an address deeper in a site", () => {
  assert.equal(
    writtenAddress("https://example.com/projects/one"),
    "example.com/projects/one",
  );
});

test("writtenAddress keeps a query and a fragment", () => {
  assert.equal(
    writtenAddress("https://example.com/watch/?v=one#start"),
    "example.com/watch?v=one#start",
  );
});

test("writtenAddress writes an email link as the address", () => {
  assert.equal(
    writtenAddress("mailto:someone@example.com"),
    "someone@example.com",
  );
});

test("arrowTail keeps a one-word label whole with the arrow", () => {
  assert.deepEqual(arrowTail("Website"), { start: "", end: "Website" });
});

test("arrowTail keeps the last word of a sentence with the arrow", () => {
  assert.deepEqual(arrowTail("Watch the trailer"), {
    start: "Watch the ",
    end: "trailer",
  });
});

test("arrowTail breaks an address after its last dot, slash, hyphen or @", () => {
  assert.deepEqual(arrowTail("github.com/elias-garcia"), {
    start: "github.com/elias-",
    end: "garcia",
  });
  assert.deepEqual(arrowTail("someone@example.com"), {
    start: "someone@example.",
    end: "com",
  });
});

test("arrowTail keeps only three characters of a long last word", () => {
  assert.deepEqual(arrowTail("a supercalifragilistic"), {
    start: "a supercalifragilis",
    end: "tic",
  });
});

test("arrowTail keeps three characters when the label ends on a break", () => {
  assert.deepEqual(arrowTail("example.com/"), {
    start: "example.c",
    end: "om/",
  });
});

test("arrowTail counts an emoji as one character", () => {
  assert.deepEqual(arrowTail("Party 🎉"), { start: "Party ", end: "🎉" });
});

test("arrowTail never cuts an emoji made of several code points", () => {
  const family = "👨‍👩‍👧‍👦";
  assert.deepEqual(arrowTail(`a ${family.repeat(13)}`), {
    start: `a ${family.repeat(10)}`,
    end: family.repeat(3),
  });
});
