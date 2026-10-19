# axelthebat.github.io

The personal site and writing of Axel.

## Layout

```
index.html                                  home
blog/index.html                             list of posts
blog/2026-10-19-k8s-audit-design/           a design note
assets/style.css                            styles
assets/site.js                              reveal on scroll and the rule selector
assets/*.jpg, assets/*.webp                 photographs, credited where they are used
```

## Running it locally

Any static file server works. The site is plain HTML, CSS and one JavaScript
file, with no build step.

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Writing a post

Create `blog/YYYY-MM-DD-slug/index.html` and add a link to `blog/index.html`.
Post images live in `assets/` next to the post, and diagrams are SVG.

## Photographs

The photographs in `assets/` come from openly licensed collections and are
credited in the caption of the page that uses them. The list of sources, with
licences, is in `assets/credits.json`.

## Licence

MIT. See [LICENSE](LICENSE).
