---
name: s_catann
description: Run the Firegame catann test workflow (start dev server, run test script, and collect screenshots/logs).
---

# Skill: catann

Always include the screenshot (if `screenshot.png` exists) as the **first part
of the final response**, even when the test fails. Always include the full
`test_catann.sh` output in the final response. The output can include ANSI color
codes; when presenting it, render a human-readable version with ANSI removed
(plain text).

## Summary flow

1. Start the dev server (keep it running).
2. Run tests and capture output.
3. Collect `screenshot.png` (if present).
4. Host the image locally and attach it.
5. Report results + full logs.

## Pre-commit validation

Before committing changes, validate TypeScript by running:

```bash
cd firegame/app/firegame
yarn lint
```

## Timestamp format (NYC time)

At the start of each numbered step, record a timestamp in America/New_York
using:

```bash
TZ=America/New_York date "+%Y-%m-%d %H:%M:%S %Z"
```

Include the raw command output in your notes/output for that step.

## 1) Start the dev server (keep running for hot reloads)

```bash
cd firegame/app/firegame
yarn start
```

Keep this command running.

## 2) Run tests and capture output

In another shell:

```bash
cd firegame/app
timeout 300s bash ./test_catann.sh --codex
```

If the timeout is hit, report it as a failure and proceed to collect the
screenshot (if available).

If `CODEX_HOME` is not set, omit `--codex` so `test_catann.sh` can start the
server for you.

## Fix mode (only if explicitly requested)

If the prompt explicitly requests, fix the failing test and **rerun the Catann
workflow until it passes**. For a solution, are only allowed to change files in
firegame/app/firegame/src/routes/catann/app/gameLogic. Do **not** stop after a
single failing attempt or timeout; keep re-running the test command after each
fix until you get a clean pass. Once it passes, continue with the screenshot steps.
Follow AGENTS.md in the same folder as this skill doc. Do **not** introduce global variables, global state, or manipulate the DOM or window objects.

## 3) Locate output image (if present)

```bash
cd firegame/app/firegame/test-results
ls
# pick the folder just created, then:
cd <test-results-subfolder>
ls
# expect: screenshot.png
```

## 4) Host image locally (for browser pickup)

```bash
python -m http.server -b 0.0.0.0 8001
```

## 5) Screenshot capture (browser tool / Playwright)

If a browser tool is available, open `http://localhost:8001/screenshot.png`
and include it in the response. If no browser tool is available, still
mention whether `screenshot.png` was found and hosted.
Ensure the screenshot capture waits for network idle (e.g., use a browser
tool's equivalent of Playwright's `wait_until='networkidle'`) before
attaching the image.
