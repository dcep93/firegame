---
name: c_catann
description: Improve the Firegame Catann choreography when the Catann Playwright test fails, by editing only Catann game logic or canvas click choreography and then re-running the s_catann test workflow. Use for requests to fix Catann test failures or refine the choreography driving Catann interactions, including time-boxed fixes (often ~15 minutes) that must package partial progress cleanly if time runs out.
---

# Skill: c_catann

## Overview

Fix Catann test failures by refining the choreography that drives the Catann game UI, while delegating test execution and artifact collection to the s_catann workflow.

## Workflow

Read this entire SKILL.md and ./FINDINGS.md before taking any action.

1. Run the s_catann workflow to reproduce the failure and capture logs/screenshots.
2. Identify the failing choreography and adjust Catann logic.
3. Re-run the s_catann workflow until the test passes.
4. Summarize changes and update skills/s_catann/AGENTS.md with new discoveries.

## Timebox support

If the user provides a time constraint, treat it as a soft stop:

- Prefer changes that advance the choreography even if the full test does not pass.
- When time expires, stop immediately and package the work:
  - MUST DO: append to ./FINDINGS.md, organize by topic
    1. what would've saved time to get your bearings
    2. what you changed
    3. why the test isn't passing
    4. next suggested step

## Constraints (must follow)

- Only edit files under `firegame/app/firegame/src/routes/catann/app/gameLogic`.
- You may also edit test/choreo.ts, but you may not add imports.
- If a required change is outside those locations, **stop and report what you need to change** instead of editing.
- Never manipulate `__socketCatannMessages`

## Notes

- Always follow `firegame/.codex/skills/s_catann/SKILL.md` for the test workflow.
- Maintain `firegame/.codex/skills/c_catann/AGENTS.md` similar to the s_catann guide: update it in-place when you discover new Catann-specific choreography knowledge.

## Time constraint default

If no time constraint is provided, stop after implementing a single code improvement and present the change.

## Known choreography expectations

- The test compares recorded socket message bytes after filtering heartbeats.
- The choreography should drive the UI through **click interactions only**.
- In responses, lead with the final JSON message successfully handled in the last Catann run (the final logged message before the first error).
