# JASS Privacy Compass v1.0.0

A Windows-first, local-first desktop directory for discovering privacy-conscious software, reviewing trade-offs, saving a shortlist, and comparing options.

## v1.0 features

- Search across a curated starter catalogue and filter by category.
- Filter by open-source/open-data status, self-hosting, and local/offline options.
- Review each entry's hosting model, account requirements, encryption notes, caveats, platforms, and evidence links.
- Save favourites and compare tools side by side.
- Export local favourites/comparison preferences as JSON.
- No user account, analytics SDK, advertising, or remote preference sync.
- Electron renderer is sandboxed; Node integration is disabled; context isolation is enabled; the preload exposes only static app metadata.

## Important scope and trust statement

The catalogue contains starter reviews with source links, not formal security audits or guarantees. Privacy properties can change with versions, settings, hosting providers, plugins, and user behaviour. Check current vendor documentation and assess your own threat model before relying on any entry. `reviewed` is the record preparation date, not proof that every vendor claim has been independently audited on that date. A future catalogue review workflow should track source checked, reviewer, change history, and re-review date per claim.

The app itself uses browser `localStorage` for favourites and comparison selections. This data stays in the local Electron profile and is not sent to a JASS server. Do not treat this as encrypted storage for sensitive secrets. External links open in the system browser; opening a website necessarily discloses the normal connection metadata to that website.

## Requirements

- Windows 10/11
- Node.js 20 LTS or newer
- npm

## Run in development

Open PowerShell in this project directory:

```powershell
npm install
npm run check
npm run dev
```

## Build and package

```powershell
npm run build
npm run dist:win
```

The Windows installer will be written to `release/`.

## Repository creation and push (run only after local verification)

With Git and GitHub CLI (`gh`) installed and authenticated, run in PowerShell from the project directory:

```powershell
git init
git add .
git diff --cached --stat
git commit -m "Initial release: JASS Privacy Compass v1.0.0"
git branch -M main
gh repo create JassDigital/JASS-Privacy-Compass --public --source=. --remote=origin --push
```

Review the staged files before committing. Do not commit `node_modules`, local preferences, credentials, or private data.

## Licence

Application code: MIT. Catalogue entries are factual summaries with links to their respective official documentation and project repositories; each linked project retains its own licence and terms. This project is independent and is not affiliated with the listed services.
