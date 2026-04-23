# NAMI St. Louis — Community Mental Health Hub

Prototype of a mental-health-first community site for NAMI St. Louis. Built as plain static files (HTML / CSS / vanilla JS) so it can be deployed to GitHub Pages and handed to anyone to try in a browser — no server, no login, no account.

## What's in the prototype

### For people who are struggling
- **Always-visible crisis banner**: 988 call/text, Crisis Text Line (HOME → 741741), St. Louis BHR mobile crisis (314-469-6644), 911.
- **"I need help now" button** (floating, bottom-right): one-tap triage overlay with every crisis option plus a jump to the user's personal safety plan.
- **Safety plan builder** (Stanley-Brown structure, 7 steps starting with *reasons for living*). Stored only in the browser on the user's device. Auto-saves on blur. Print / Save-as-PDF for sharing with a clinician.
- **Quick Exit** (top-right, or double-tap `Esc`): redirects to a neutral page for users on shared or unsafe devices.

### For supporters, staff, and the community
- **Programs directory** — Peer-to-Peer, Family-to-Family, support groups, education, crisis programs.
- **Shared community calendar** — anyone can post events (support groups, trainings, fundraisers, volunteer shifts).
- **Volunteer board** — post opportunities, sign up, track spots.
- **Community board** — announcements, stories, questions, resource-sharing.
- **Resources** — curated crisis lines, providers, housing, legal aid, benefits navigation for the St. Louis region.
- **Missouri policy explorer** — data, risks, and sources across six focus areas.

### Accessibility + safety
- Sticky crisis banner; skip-link to main content; keyboard navigable.
- Dark/light mode follows system preference; respects `prefers-reduced-motion`.
- No tracking, no third-party analytics — the app never transmits what the user types. Safety plans never leave the device.
- Single `Esc` closes an open dialog; double `Esc` triggers quick exit.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static file server works; there is no build step.

## Deploy to GitHub Pages

The repo ships with a GitHub Actions workflow at `.github/workflows/deploy.yml`. After pushing to `main`, enable Pages:

**Settings → Pages → Source → GitHub Actions**

The site will be available at `https://<owner>.github.io/<repo>/`.

## Project layout

```
nami-st-louis/
├── index.html              Entry point
├── styles.css              All styling (light + dark, print, reduced-motion)
├── app.js                  Routing, modules, safety plan, quick exit, help FAB
├── storage.js              Tiny localStorage wrapper
├── programs-data.js        NAMI STL programs (editable)
├── resources-data.js       Crisis lines / providers / housing / legal
├── policy-data.js          Missouri policy focus areas
├── .github/workflows/
│   └── deploy.yml          Pages deploy workflow
├── LICENSE                 MIT
└── README.md
```

## Customization

- **Programs**: edit `programs-data.js`
- **Resources**: edit `resources-data.js` (verify phone numbers and URLs for your region)
- **Policy data**: edit `policy-data.js`
- **Branding / colors**: edit the CSS variables in `styles.css` under `:root`

## Prototype caveats

- Shared community data (events, posts, volunteer opportunities) is stored in the visitor's own `localStorage`. It is **not** shared across devices. A real deployment would need a backend (Supabase, Firebase, or a small API) — `storage.js` is designed to be swapped without touching the modules.
- Phone numbers and resource links should be reviewed by NAMI STL staff before production.
- Safety-plan content never leaves the device. Clearing browser data deletes the plan; the UI encourages Print / Save-as-PDF to keep a copy.
- The Safety Plan UI is a self-help tool and not a substitute for clinical care. If you are in crisis, call or text **988**.

## License

MIT.
