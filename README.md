# Sorina Lash Studio

React/Vite website foundation for a premium lash studio.

## Commands

PowerShell blocks `npm.ps1` on this machine, so use `npm.cmd`:

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

Hidden local dev server, with logs:

```powershell
.\scripts\dev-server.cmd
```

If npm hits a certificate issue, use Node system certificates:

```powershell
node --use-system-ca "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
```

## Project Memory

- `AGENTS.md` - working rules for agents.
- `docs/PROJECT_BRIEF.md` - product/design source of truth.
- `docs/RESEARCH_NOTES.md` - external research and risk notes.
- `docs/WORKLOG.md` - setup and decision log.
- `docs/reference/mockup_site_gene_react.jsx` - original user mockup copied for reference.

## Current State

The app is a first working foundation, not the final design. It still needs real photos, verified claims, prices, contact details, testimonials, and the chosen booking path.
