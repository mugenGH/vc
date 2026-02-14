# HOLLOW CREEK — V2 Plan

## Overview
This document captures the V2 scope, prioritized features, implementation steps, and quick run instructions. The original v1 has been backed up as `index_v1_backup.html`.

## Goals
- Upgrade visuals, audio, and interactivity to a polished V2 experience.
- Add procedural audio (Web Audio API), particle FX (Canvas), QTE/puzzle systems, save/load, achievements, and improved UI.
- Keep the game single-file-friendly but modularize JS/CSS for maintainability.

## High-level Feature List
- Procedural audio engine (no required external music files; optional background tracks)
- Canvas particle system (grain, dust, embers, fog, rain)
- Main menu + settings (text speed, volumes, screen effects)
- Save / Load (3 slots + autosave) using localStorage
- Achievement & journal system with toasts
- QTE and puzzle modules (timed inputs, combination locks)
- Enhanced FX: chromatic aberration, CRT scanlines, screen-shake, glitch text
- Expanded branching scenes and at least 3 endings

## Files (plan)
- `index.html` — V2 entry (replace when ready)
- `js/audioEngine.js` — procedural audio + sfx manager
- `js/gameEngine.js` — main scene/state management (refactor from v1 script)
- `js/particles.js` — canvas particle/FX system
- `js/qte.js` — QTE & puzzle handlers
- `js/saveLoad.js` — save/load + achievements
- `css/v2.css` — visual styles and effects
- `assets/` — optional audio/images (kept minimal)
- `V2_PLAN.md` — this file

## Implementation Plan (short)
1. Create modular JS files and import from a single `index.html`.
2. Implement Audio Engine (Web Audio API) + fallback to <audio> tags.
3. Build Canvas Particle System with toggles for performance.
4. Migrate scenes to `gameEngine.js`, add save/load hooks.
5. Add QTE/puzzle modules and achievements.
6. Polish UI, settings panel, main menu, and accessibility.
7. Test across browsers, fix regressions, finalize `index.html`.

## Quick Dev Notes
- Development run: open `index.html` in browser (serve via simple static server for AudioContext autoplay reliability).
- Recommended test server (from project root):

```powershell
# Windows (PowerShell)
python -m http.server 8000
# then open http://localhost:8000/oulas%20like/index.html
```

## TODO (short)
- [ ] Implement `js/audioEngine.js`
- [ ] Implement `js/particles.js`
- [ ] Refactor scene script into `js/gameEngine.js`
- [ ] Add save/load + achievements
- [ ] Replace `index.html` with V2 build

## Notes
- Backup: `index_v1_backup.html` (original v1 saved). Do not delete.
- If you want, I can start by scaffolding the JS modules and a minimal V2 `index.html` next.

---
Created: 2026-02-14
