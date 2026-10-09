import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import footnote from "markdown-it-footnote";

import site from "./src/_data/site.json" with { type: "json" };

export const config = {
  dir: { input: "src", output: "dist" },
  // Posts are prose, so a `{{` in one is text rather than a template tag.
  markdownTemplateEngine: false,
};

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/*.{ico,png}");
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2": "fonts/archivo.woff2",
    "node_modules/@fontsource-variable/literata/files/literata-latin-opsz-normal.woff2": "fonts/literata.woff2",
    "node_modules/@fontsource-variable/literata/files/literata-latin-opsz-italic.woff2": "fonts/literata-italic.woff2",
  });

  eleventyConfig.addGlobalData("buildYear", new Date().getUTCFullYear());

  eleventyConfig.amendLibrary("md", (md) => md.use(footnote));
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "writings" },
    metadata: {
      title: `Sporadic Writings · ${site.author}`,
      subtitle: site.tagline,
      language: "en",
      base: site.url,
      author: { name: site.author },
    },
  });

  eleventyConfig.addCollection("writingsNewestFirst", (collections) =>
    collections.getFilteredByTag("writings").reverse(),
  );

  // Dates in front matter are calendar days, which Eleventy reads as UTC
  // midnight; formatting them in UTC keeps the day the post was dated.
  eleventyConfig.addFilter("longDate", (date) =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
  );
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));
  eleventyConfig.addFilter("year", (date) => date.getUTCFullYear());
}
