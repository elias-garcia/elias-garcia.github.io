import assert from "node:assert/strict";
import { test } from "node:test";
import { writtenAddress } from "./links.ts";

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
