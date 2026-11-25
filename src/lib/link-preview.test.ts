import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addressTitle,
  imageType,
  namedSite,
  previewDomain,
  readShareData,
} from "./link-preview.ts";

const address = "https://example.com/posts/one";

function bytes(text: string): Uint8Array {
  return Uint8Array.from(text, (character) => character.charCodeAt(0));
}

test("readShareData reads the Open Graph tags", () => {
  assert.deepEqual(
    readShareData(
      `<head>
        <meta property="og:title" content="A post">
        <meta property="og:image" content="https://cdn.example.com/a.jpg">
        <meta property="og:site_name" content="Example">
        <meta property="og:type" content="video.other">
      </head>`,
      address,
    ),
    {
      title: "A post",
      image: "https://cdn.example.com/a.jpg",
      siteName: "Example",
      type: "video.other",
    },
  );
});

test("readShareData falls back to the page's first <title>", () => {
  assert.deepEqual(
    readShareData(
      "<title>\n  The page &amp; more\n</title><svg><title>Icon</title></svg>",
      address,
    ),
    { title: "The page & more" },
  );
});

test("readShareData keeps the first of a repeated tag", () => {
  assert.deepEqual(
    readShareData(
      `<meta property="og:title" content="First">
       <meta property="og:title" content="Second">`,
      address,
    ),
    { title: "First" },
  );
});

test("readShareData resolves a relative image against the page", () => {
  assert.deepEqual(
    readShareData('<meta property="og:image" content="/cover.png">', address),
    { image: "https://example.com/cover.png" },
  );
});

test("readShareData leaves out an image that isn't https", () => {
  assert.deepEqual(
    readShareData(
      `<meta property="og:image" content="http://example.com/a.jpg">
       <meta property="og:image" content="data:image/svg+xml,<svg/>">`,
      address,
    ),
    {},
  );
});

test("readShareData ignores empty tags and runs no markup", () => {
  assert.deepEqual(
    readShareData(
      `<meta property="og:title" content="  ">
       <meta property="og:site_name" content="<script>alert(1)</script>">`,
      address,
    ),
    { siteName: "<script>alert(1)</script>" },
  );
});

test("imageType names the formats the image pipeline takes", () => {
  assert.equal(imageType(bytes("\xFF\xD8\xFF\xE0rest")), "jpg");
  assert.equal(imageType(bytes("\x89PNG\r\n\x1A\nrest")), "png");
  assert.equal(imageType(bytes("GIF89a")), "gif");
  assert.equal(imageType(bytes("RIFF\0\0\0\0WEBPVP8 ")), "webp");
  assert.equal(imageType(bytes("\0\0\0\x1CftypavifX")), "avif");
});

test("imageType refuses SVG and anything else", () => {
  assert.equal(
    imageType(bytes("<svg xmlns='http://www.w3.org/2000/svg'>")),
    undefined,
  );
  assert.equal(imageType(bytes("<!doctype html>")), undefined);
  assert.equal(imageType(new Uint8Array()), undefined);
});

test("previewDomain drops www", () => {
  assert.equal(
    previewDomain("https://www.youtube.com/watch?v=one"),
    "youtube.com",
  );
  assert.equal(previewDomain("https://blog.example.com/a"), "blog.example.com");
});

test("addressTitle keeps the host and path only", () => {
  assert.equal(
    addressTitle("https://www.example.com/blog/a-post/?ref=one#top"),
    "example.com/blog/a-post",
  );
  assert.equal(addressTitle("https://example.com/"), "example.com");
});

test("namedSite drops a name that only repeats the domain", () => {
  const video = "https://www.youtube.com/watch?v=one";
  assert.equal(namedSite("YouTube", video), undefined);
  assert.equal(namedSite("GitHub", "https://github.com/someone"), undefined);
  assert.equal(namedSite("Balio", video), "Balio");
  assert.equal(namedSite(undefined, video), undefined);
});
