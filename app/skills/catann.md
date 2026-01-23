# Skill: test_catann

Packages should already be installed. If anything tries to install
dependencies, stop and ask the user first. Never run package installs
(e.g., `yarn install`, `npm install`, `pnpm install`). Always include the
full `test_catann.sh` output in the final response. If `screenshot.png`
exists, always show it in the response even when the test fails.

## Summary flow

1. Start the dev server
2. Run tests and capture output.
3. Collect `screenshot.png` (if present).
4. Host the image locally and attach it.
5. Report results + full logs.

## 1) Start the dev server (keep running for hot reloads)

```bash
cd /workspace/firegame/app/firegame
yarn start
```

Keep this command running.

## 2) Run tests and capture output

In another shell:

```bash
cd /workspace/firegame/app
timeout 300s bash ./test_catann.sh --codex
```

If the timeout is hit, report it as a failure and proceed to collect the
screenshot (if available).

## Fix mode

If the prompt explicitly requests, fix the failing test and rerun it until
it passes, then continue with the screenshot steps.

## 3) Locate output image (if present)

```bash
cd /workspace/firegame/app/firegame/test-results
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

## 6) Include `test_catann.sh` logs in final response

Always paste the full log output, even on success.
