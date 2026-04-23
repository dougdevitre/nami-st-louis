# NAMI St. Louis — Community Mental Health Hub

A comprehensive, open-source community platform for NAMI St. Louis — combining policy advocacy, program directories, shared calendars, volunteer coordination, resource libraries, and community discussion into a single deployable web app.

## Live site

After deploying: `https://<your-github-username>.github.io/nami-stl-community-hub/`

## Platform modules

| Module | Description |
|--------|-------------|
| **Policy explorer** | Six Missouri mental health policy focus areas with data, sources, and advocacy tools |
| **Programs** | Directory of NAMI programs (Peer-to-Peer, Family-to-Family, support groups, education, crisis) with enrollment info |
| **Community calendar** | Shared calendar for events, meetings, trainings — anyone can submit events for community review |
| **Volunteers** | Volunteer opportunity board — post needs, sign up, track hours and roles |
| **Resources** | Curated resource library — crisis lines, provider directories, housing, legal aid, benefits navigation |
| **Community board** | Discussion and announcements — share stories, coordinate, and connect |

## Features

- **Zero backend** — all shared data stored via browser-compatible storage; deploys as static files
- **Mobile-first responsive** — works on phones, tablets, desktops
- **Dark/light mode** — auto-detects system preference
- **Accessible** — semantic HTML, ARIA labels, keyboard navigation
- **Deep linking** — URL hash routes to any module or program
- **988 crisis banner** — persistent access to crisis resources
- **No login required** — open community access by design

## Deployment

```bash
git init
git add .
git commit -m "Initial commit — NAMI STL Community Hub"
git branch -M main
git remote add origin https://github.com/<USERNAME>/nami-stl-community-hub.git
git push -u origin main
```

Then: **Settings → Pages → Source → GitHub Actions**

## Project structure

```
nami-stl-community-hub/
├── index.html
├── src/
│   ├── styles.css
│   ├── policy-data.js
│   ├── programs-data.js
│   ├── resources-data.js
│   ├── app.js
│   └── storage.js
├── .github/workflows/deploy.yml
├── LICENSE
└── README.md
```

## Customization

- **Programs**: Edit `src/programs-data.js` to add/modify NAMI programs
- **Resources**: Edit `src/resources-data.js` to update crisis lines, providers, and community resources
- **Policy data**: Edit `src/policy-data.js` to update legislative tracking and advocacy data
- **Branding**: Edit CSS variables in `src/styles.css` (`:root` block) for colors, fonts, spacing

## License

MIT — free for NAMI St. Louis and all NAMI affiliates.
