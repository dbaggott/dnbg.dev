// Checks the built site in dist/ (run `npm run build` first) against what its
// host serves it with: the CSP in dbaggott/infrastructure's modules/static-site
// allows same-origin resources only, and no inline script or style.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  );
}

function read(extension) {
  return files(dist)
    .filter((file) => file.endsWith(extension))
    .map((file) => ({ name: relative(dist, file), text: readFileSync(file, "utf8") }));
}

const pages = read(".html").map(({ name, text }) => ({ name, html: text }));
const stylesheets = read(".css");

// An attribute's values, however they are quoted.
function attributes(html, attribute) {
  return [...html.matchAll(new RegExp(`\\s${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "gi"))]
    .map((m) => m[1] ?? m[2] ?? m[3]);
}

function srcsetUrls(html) {
  return attributes(html, "srcset").flatMap((set) => set.split(",").map((c) => c.trim().split(/\s+/)[0]));
}

function sameSite(url) {
  return url.startsWith("/") && !url.startsWith("//");
}

// A path the host can serve: a file, or a directory with an index.html. The
// host redirects a directory named without its slash, so links carry it.
function served(path) {
  const target = join(dist, decodeURIComponent(path));
  return path.endsWith("/") ? existsSync(join(target, "index.html")) : existsSync(target);
}

test("the pages the host needs are built", () => {
  for (const page of ["index.html", "404.html", "feed.xml"]) {
    assert.ok(existsSync(join(dist, page)), `${page} is missing`);
  }
});

test("every page loads resources from its own origin only", () => {
  for (const { name, html } of pages) {
    const loaded = [
      ...attributes(html, "src"),
      ...srcsetUrls(html),
      ...[...html.matchAll(/<link\b[^>]*>/g)]
        .filter(([tag]) => !/rel="(canonical|alternate)"/.test(tag))
        .flatMap(([tag]) => attributes(tag, "href")),
    ];
    for (const url of loaded) {
      assert.ok(sameSite(url), `${name} loads ${url} from another origin`);
    }
  }
  for (const { name, text } of stylesheets) {
    for (const [, url] of text.matchAll(/url\(\s*["']?([^"')]+)/g)) {
      assert.ok(sameSite(url), `${name} loads ${url} from another origin`);
    }
  }
});

test("no page has inline script or style", () => {
  for (const { name, html } of pages) {
    assert.doesNotMatch(html, /<script(?![^>]*\ssrc=)[^>]*>/, `${name} has an inline script`);
    assert.doesNotMatch(html, /<style\b/, `${name} has a style element`);
    assert.equal(attributes(html, "style").length, 0, `${name} has a style attribute`);
  }
});

test("every same-site link and resource resolves", () => {
  for (const { name, html } of pages) {
    const urls = [...attributes(html, "href"), ...attributes(html, "src"), ...srcsetUrls(html)]
      .filter(sameSite)
      .map((url) => url.split("#")[0]);
    for (const url of urls) {
      assert.ok(served(url), `${name} links to ${url}, which is not in the build`);
    }
  }
  for (const { name, text } of stylesheets) {
    for (const [, url] of text.matchAll(/url\(\s*["']?([^"')]+)/g)) {
      assert.ok(served(url), `${name} loads ${url}, which is not in the build`);
    }
  }
});
