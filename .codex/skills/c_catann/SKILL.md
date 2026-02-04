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
4. Update `skills/c_catann/AGENTS.md` with new choreography knowledge.
5. MUST DO: append to ./FINDINGS.md, organized by topic:
   a. what would've saved time to get your bearings
   b. what you changed
   c. why the test isn't passing
   d. next suggested step

## Timebox support

If the user provides a time constraint, treat it as a soft stop:

- Prefer changes that advance the choreography even if the full test does not pass.
- When time expires, stop immediately and package the work.

## Constraints (must follow)

- Only run this skill when explicitly instructed by the user.
- Only edit files under `firegame/app/firegame/src/routes/catann/app/gameLogic`.
- You may also edit test/choreo.ts, but you may not add imports.
- If a required change is outside those locations, **stop and report what you need to change** instead of editing.
- Never manipulate `__socketCatannMessages`
- Game-logic edits must be done one at a time (single focused change per run).
  Choreography additions can be batched.

## Notes

- Always follow `firegame/.codex/skills/s_catann/SKILL.md` for the test workflow.
- Keep `firegame/.codex/skills/c_catann/AGENTS.md` updated with new choreography knowledge.
- Debug flow to keep in mind: iframe -> `handleMessage` -> `parseClientData` ->
  `applyGameAction` -> `setFirebaseData` -> `FirebaseWrapper` diff ->
  `sendToMainSocket` -> iframe.

## Time constraint default

If no time constraint is provided, keep iterating and updating `test/choreo.ts` until the test passes or until the second time you need to change `gameLogic`. At that point, stop and report what remains.

## Known choreography expectations

- The test compares recorded socket message bytes after filtering heartbeats.
- The choreography should drive the UI through **click interactions only**.
- In responses, lead with the `console.log({ codex: ... })` object
