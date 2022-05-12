# yevis-web

[![DOI](https://zenodo.org/badge/442338847.svg)](https://zenodo.org/badge/latestdoi/442338847)
[![Apache License](https://img.shields.io/badge/license-Apache%202.0-orange.svg?style=flat&color=important)](http://www.apache.org/licenses/LICENSE-2.0)

Web application for browsing Yevis workflow registry.

**[https://ddbj.github.io/yevis-web/](https://ddbj.github.io/yevis-web/)** is deployed for [`ddbj/workflow-registry`](https://github.com/ddbj/workflow-registry).

In addition, see the below links:

- [`ddbj/workflow-registry`](https://github.com/ddbj/workflow-registry): a workflow registry built and maintained by [DDBJ](https://www.ddbj.nig.ac.jp/) using `yevis-cli`
- [`ddbj/yevis-cli`](https://github.com/ddbj/yevis-cli): a CLI tool to support building and maintaining Yevis workflow registry
- [`Yevis Getting Started`](https://github.com/ddbj/yevis-cli/blob/main/docs/getting_started.md): the document for Yevis system installation and usage
- [`Yevis Getting Started Ja`](https://github.com/ddbj/yevis-cli/blob/main/docs/getting_started_ja.md): 日本語での Yevis system の使い方

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

To deploy `yevis-web` to GitHub Pages, application `base` needs to be set. (See [Vite - Guide - GitHub Pages](https://vitejs.dev/guide/static-deploy.html#github-pages) as a reference)

Pass the environment variable `YEVIS_WEB_BASE` to set `base` at build time:

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

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).
See the [LICENSE](https://github.com/ddbj/yevis-cli/blob/main/LICENSE).
