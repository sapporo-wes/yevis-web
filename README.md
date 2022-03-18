# yevis-web

Web application for browsing workflows deployed by [ddbj/yevis-cli](https://github.com/ddbj/yevis-cli).

## Development

Launch the development server:

```bash
$ npm run dev
> yevis-web@0.0.0 dev
> vite
  vite v2.8.3 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose
```

### Build and Deploy

See [Vite - Guide - Deploying a Static Site](https://vitejs.dev/guide/static-deploy.html) as a reference.

Build and local preview:

```bash
$ npm run build
$ npm run preview
```

---

To manage the `yevis-web`, describe a `.env` file as follows:

```
VITE_WF_REPO=ddbj/yevis-workflows
VITE_WF_REPO_GH_PAGES_BRANCH=gh-pages
VITE_TRS_ENDPOINT=https://ddbj.github.io/yevis-workflows/
```

As an explanation of these variables:

- `VITE_WF_REPO`: GitHub repository deployed by `yevis-cli`.
- `VITE_WF_REPO_GH_PAGES_BRANCH`: A branch name of the GitHub repository deployed by `yevis-cli`.
- `VITE_TRS_ENDPOINT`: An endpoint of the GA4GH Tool Registry Service (TRS) API. Usually, an endpoint of GitHub Pages.

This example is set with default values.
Create a `.env` file and set them to change them.

---

To deploy the `yevis-web` to GitHub Pages, the application `base` needs to be set. (See [Vite - Guide - GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages) as a reference)

Pass the environment variable `YEVIS_WEB_BASE` to set the `base` at build time:

```bash
$ YEVIS_WEB_BASE=/yevis-web/ npm run build
$ YEVIS_WEB_BASE=/yevis-web/ npm run preview
```

---

Then deploy to GitHub Pages using [npm - gh-pages](https://www.npmjs.com/package/gh-pages), etc.

```bash
$ npm install -g gh-pages
$ gh-pages -d ./dist
```

## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0). See the [LICENSE](https://github.com/ddbj/yevis-cli/blob/main/LICENSE).
