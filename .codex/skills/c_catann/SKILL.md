---
name: c_catann
description: Improve the Firegame Catann choreography when the Catann Playwright test fails, by editing only Catann game logic or canvas click choreography and then re-running the s_catann test workflow. Use for requests to fix Catann test failures or refine the choreography driving Catann interactions.
---

# Skill: c_catann

## Overview

Fix Catann test failures by refining the choreography that drives the Catann game UI, while delegating test execution and artifact collection to the s_catann workflow.

## Workflow

1) Run the s_catann workflow to reproduce the failure and capture logs/screenshots.
2) Identify the failing choreography and adjust Catann logic.
3) Re-run the s_catann workflow until the test passes.
4) Summarize changes and update AGENTS.md with new discoveries.

## Constraints (must follow)

- Only edit files under `firegame/app/firegame/src/routes/catann/app/gameLogic`.
- You may also adjust **canvas clicks** inside the choreography function if needed.
- If a required change is outside those locations, **stop and report what you need to change** instead of editing.

## Notes

- Always follow `firegame/.codex/skills/s_catann/SKILL.md` for the test workflow.
- Maintain `firegame/.codex/skills/c_catann/AGENTS.md` similar to the s_catann guide: update it in-place when you discover new Catann-specific choreography knowledge.
