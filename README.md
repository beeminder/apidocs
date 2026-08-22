# Beeminder API Documentation

This repository contains the source for the website of the Beeminder API Reference https://api.beeminder.com.

To Do
------------

* More prominent link to Beeminder
* [for bee] Possibly update links to api in beeminder/beeminder to have target=blank

Contributing 
------------------------------

If you're working on building something with our API and you run into confusion, we'd love to hear about it!
If something's not clear in the docs, or something's not working as you expect it to, it might be us, not you!
If you do find something that needs clarification or is just plain wrong, we'd love a pull request with fixes or edits. 


### Prerequisites

You're going to need:

 - **Node.js, version 22.12 or newer** (what Astro itself requires)
 - **pnpm** — `corepack enable` will install the version pinned in `package.json`.

### Getting Set Up

1. Fork this repository on Github.
2. Clone *your forked repository* (not our original one) to your hard drive with `git clone https://github.com/YOURUSERNAME/apidocs.git`
3. `cd apidocs`
4. Install and start the dev server:

```shell
pnpm install
pnpm dev
```

You can now see the docs at http://localhost:4321. Whoa! That was fast!

The docs themselves are the Markdown files in `src/content/docs/`. Everything else is
[Astro Starlight](https://starlight.astro.build) configuration.

### Submitting 

Once you've made your changes, you can submit a pull request to beeminder/apidocs!

### Deploying changes to the docs

(For beeminder/apidocs owners)

Merging to `master` deploys to https://api.beeminder.com automatically, via the Render
static site defined in `render.yaml`. Pull requests get their own preview URL.

Two checks guard the docs:

```shell
pnpm build && pnpm check:anchors
```

`check:anchors` fails if any internal link, or any of the anchors the pre-2026 single-page
site exposed (`api.beeminder.com/#getgoal` and friends), stops resolving. Those legacy
anchors are listed in `src/legacy-anchors.js`; the file explains why that list is
hardcoded rather than generated.



Need Help? Found a bug?
--------------------

[Submit an issue](https://github.com/beeminder/slate/issues), or email support@beeminder.com if you need any help.



