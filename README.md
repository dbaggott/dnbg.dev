# dnbg.dev

Dan Baggott's site, served at <https://www.dnbg.dev>: projects, writing and
publications. It is static, built with [Eleventy](https://www.11ty.dev).

## Developing

Node comes from `.tool-versions` (`mise install`).

```bash
npm install
npm run dev                  # http://localhost:8080, rebuilding on save
npm run build && npm test    # build dist/, then check it
```

## Content

- **Projects** are `src/_data/projects.json`, listed in the order they appear.
- **Writing** is one Markdown file per post in `src/writings/`, served at
  `/writings/<file name>/`. Front matter takes a `title` and a `date`.
- **Publications** are `src/_data/publications.json`.

## Releasing

Every push to `main` builds the site and publishes it as a release; see
`.github/workflows/ci.yml`. Publishing changes nothing a visitor sees. A release
goes live with `apps/app deploy dnbg-dev main` in dbaggott/infrastructure.
