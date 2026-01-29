---
name: c_catann
description: Improve the Firegame Catann choreography when the Catann Playwright test fails, by editing only Catann game logic or canvas click choreography and then re-running the s_catann test workflow. Use for requests to fix Catann test failures or refine the choreography driving Catann interactions, including time-boxed fixes (often ~15 minutes) that must package partial progress cleanly if time runs out.
---

# Skill: c_catann

## Overview

Fix Catann test failures by refining the choreography that drives the Catann game UI, while delegating test execution and artifact collection to the s_catann workflow.

## Workflow

1) Run the s_catann workflow to reproduce the failure and capture logs/screenshots.
2) Identify the failing choreography and adjust Catann logic.
3) Re-run the s_catann workflow until the test passes.
4) Summarize changes and update AGENTS.md with new discoveries.

## Timebox support

If the user provides a time constraint (often ~15 minutes), treat it as a hard stop:

- Track elapsed time and keep changes small and targeted.
- Prefer changes that advance the choreography even if the full test does not pass.
- When time expires, stop immediately and package the work:
  - Ensure files are saved and changes are coherent for a commit.
  - Report what changed, what remains, and the next suggested step.

## Constraints (must follow)

- Only edit files under `firegame/app/firegame/src/routes/catann/app/gameLogic`.
- You may also adjust **canvas clicks** inside the choreography function if needed.
- If a required change is outside those locations, **stop and report what you need to change** instead of editing.
- Never manipulate `__socketCatannMessages` or `expectedMessages`, except to perform `verifyTestMessages`.

## Notes

- Always follow `firegame/.codex/skills/s_catann/SKILL.md` for the test workflow.
- Maintain `firegame/.codex/skills/c_catann/AGENTS.md` similar to the s_catann guide: update it in-place when you discover new Catann-specific choreography knowledge.

## Time constraint default

If no time constraint is provided, stop after implementing a single code improvement and present the change.
