export default {
  layout: "post.njk",
  tags: "writings",
  permalink: (data) => `/writings/${data.page.fileSlug}/`,
};
