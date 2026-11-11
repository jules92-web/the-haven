# Haven-stuff

Julian's workspace for visualisations, dashboards and small tools for **The Haven**, a dog shelter in Wayanad, Kerala run by the NGO Paws in Wayanad (about 70 dogs across several locations, volunteer-run inside a spiritual community). Everything built here is meant to live at a **public URL on GitHub Pages** that anyone on the team can open on a phone, with no login.

Julian is not a developer. He is the shelter's Wellbeing Manager and works in short bursts, often from his phone. Explain in plain words, keep replies short, and say what you did and what he needs to do next.

## How this folder is organised

- One subfolder per project, named in lowercase with hyphens, e.g. `new-haven-plan/`. Each has its own `index.html`.
- Root `index.html`: a simple landing page listing every project with a one-line description and a link. Keep it updated whenever a project is added or renamed.
- One GitHub repository for the whole folder, Pages served from the `main` branch root. Repo name: ask Julian the first time, then write it here: `the-haven` (owner `jules92-web`).
- Project URLs look like `https://jules92-web.github.io/the-haven/<project>/`.

## How things are built

- Plain static files: HTML, CSS and JavaScript. No build step, no framework, no npm install needed to view a page. A project may have `index.html` plus `config.js`, and nothing more unless it truly needs it.
- No secrets, tokens or API keys anywhere in the repo. Everything in it is public.
- Works on a phone first (360px wide), then desktop. Light and dark mode. Readable text sizes, colour never the only signal, keyboard-usable.
- Tone: warm and clear, not corporate. Plain labels ("Not yet placed", not "Unassigned entities").
- Never rely on a CDN script you can't pin to an exact version. Prefer no external dependencies.

## Where the data comes from

Almost everything starts in Julian's Google Sheet "haven_dogs" (https://docs.google.com/spreadsheets/d/1xYsK6sSyOd_vrPtr9i9o_g9Q5bP3PCiKtG51PMyi0eA). The usual pattern for a live page:

1. Julian publishes the relevant tab to the web as CSV (File > Share > Publish to web). That step is manual, so stop and ask him to do it and paste the link.
2. The page fetches that CSV from `config.js`, parses it, and polls about once a minute and when the tab becomes visible again.
3. If a refresh fails, keep the last good data and show a quiet "showing data from hh:mm" line.

Never edit the Google Sheet unless Julian explicitly asks.

## Privacy: these pages are public

- Publish the minimum. Dog names, rooms and counts are fine. Do not publish guardian or staff names, phone numbers, medical or vet information, lab results or anything about individual people, unless Julian says yes for that specific field.
- Before publishing a tab, tell Julian in one line what becomes public.
- If a page needs more detail than is safe to publish, suggest a summary instead.

## Shelter vocabulary

- **New Haven**: the new central site. **Old Haven** and **Main Haven** are the existing ones. Dogs have a *current* and a *proposed* location in the Dog Database.
- New Haven site plan terms: Rooms 1 to 6, Terrace, Kitchen, W.C., Storage (S), and the yards. **Plan B means Yard B.** "Yard C interlock" is the paved strip along the front of the house. Yards D and E continue downhill.
- Planned (not built) fences and gates are drawn as purple dashed lines and labelled as planned.
- Only vaccinated dogs go into the main haven.

## Before you say a project is done

- Open it locally over http (not file://) with sample data, and take screenshots at phone and desktop width.
- Check every dog name is readable, and that empty and broken-data states look sensible.
- After pushing, check the live URL loads and shows real data, and give Julian the link.

## Projects

- `new-haven-plan/`: interactive New Haven site plan with each room's dogs, reading the "New Haven Rooms" tab. Started from `source-plan.html` (built earlier as a Claude artifact).
