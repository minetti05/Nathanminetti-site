# nathanminetti.com

The site for Nathan Minetti's independent strategic practice. It's built with Next.js and hosted on Vercel.

**All words on the site live in `/content`, and all images live in `/public/images`.** You can change either without touching code. Every change you push to GitHub creates a new Vercel preview automatically.

---

## Editing content

Every content file is a `.mdx` file. Each one has two parts:

```
---
title: "Settings go up here, between the two lines of dashes"
year: "2024"
---

Body text goes down here, in plain writing.
## A line starting with two hashes is a heading.
```

**Placeholders:** anything you write in `[square brackets]` shows on the site as a yellow placeholder, so gaps are easy to spot. Delete the brackets once the real text is in.

**Drafts:** text written as `[Draft for approval: …]` shows with a dashed blue outline. Once you approve it, delete the `[Draft for approval: ` at the start and the `]` at the end.

You can edit on github.com: open the file, click the pencil, change the text, then click **Commit changes**. Vercel rebuilds within a minute or two.

### The homepage

`content/pages/home.mdx` holds every line of homepage copy: the headline, intro, buttons, What I Do, Recognition and the closing line.

---

## Adding a case study

1. Copy an existing file in `content/work/`, such as `walmart-spongebob.mdx`. Name the copy after the project, in lowercase with hyphens, for example `nike-air-launch.mdx`. The file name becomes the web address: `/work/nike-air-launch`.
2. Change the settings at the top:

| Setting | What it does |
| --- | --- |
| `client` | Client name, e.g. `"Coca-Cola"` |
| `project` | Campaign or project name |
| `title` | The editorial headline for the case |
| `dek` | One sentence under the headline |
| `summary` | Short card text, used for "more work" entries |
| `year` | e.g. `"2024"` or `"2021–2022"`. The Work page sorts newest first. |
| `agency` | e.g. `"McCann"` |
| `role` | e.g. `"Account Director · Producer"` |
| `featured` | `true` puts it in Selected Work on the homepage |
| `featuredOrder` | 1, 2, 3… sets the order on the homepage (the first one is shown large) |
| `media` | `platform: youtube` (or `vimeo` / `spotify`) and `id`: just the ID, not the whole link. For `https://youtu.be/jah9gkQ74S0` the ID is `jah9gkQ74S0`. |
| `image` | Optional still. Put the file in `public/images/work/` and write `src: "/images/work/your-file.jpg"`, plus an `alt` description. With no still, the YouTube thumbnail is used. |
| `awards`, `press` | Optional lists |

3. Write the body under the headings `## Challenge`, `## Opportunity`, `## Approach` and `## Results`.
4. Commit. That's it.

Only verified facts go in a case study. If you're not sure, use a `[bracketed placeholder]`.

---

## Adding a photography project

1. Make a folder: `public/images/photography/your-project-name/`.
2. Upload your original image files into it, exactly as they are. The site **never crops, recolors or rotates them**. Each one is shown at its own original shape.
3. Copy a file in `content/photography/` and rename it to match the folder: `your-project-name.mdx`.
4. List the images in the order you want them shown, each with a short description of what's in the photograph:

```
---
title: "Your Project Name"
order: 6
homepageLead: false
images:
  - file: "01.jpg"
    alt: "A man reading on the steps of a brownstone at dusk"
  - file: "02.jpg"
    alt: "…"
---
An optional one-paragraph artist statement.
```

`homepageLead: true` makes that project the large image on the homepage. Set it on one project only.

---

## Switches

`site.config.ts` holds the site-wide settings:

- `brandsAndCulture.enabled`: `false` hides Brands & Culture from the navigation, homepage and footer, and makes its page return "not found". Change it to `true` to launch it.
- `photography.enabled`: `true` shows Photography in the navigation, homepage and footer. Set it to `false` to hide it everywhere.
- Contact email and LinkedIn link.

---

## Copying images from the old site

`.github/workflows/fetch-assets.yml` downloads every file listed in `scripts/assets-manifest.json` into the repo, byte for byte. It never resizes or overwrites anything, and it writes a report to `scripts/assets-report.txt`. It runs whenever the manifest changes. You can also run it from the **Actions** tab on GitHub.

---

## Design system

Colors, fonts, type sizes and spacing are defined once, at the top of `app/globals.css`.

| Token | Value | Use |
| --- | --- | --- |
| Warm white | `#F7F6F2` | Background |
| Charcoal | `#202020` | Text |
| Light grey | `#EAE9E4` | Panels, dividers |
| Muted olive | `#777B62` | Large type and rules only. It's too light for small text. |
| Olive (text) | `#666A53` | Small labels (passes WCAG AA) |
| Deep navy | `#24364A` | Links, hover |

Headlines are set in Cormorant Garamond and body text in Inter. Both are self-hosted.

---

## For developers

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

- `content/` holds the copy (MDX with YAML front matter, read by `lib/content.ts`)
- `app/` holds the routes and `components/` the shared UI
- Build order: foundations, homepage, Advisory, Workshops, Work, About, Contact, Photography, launch
