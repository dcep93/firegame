# Skill: test_catann

Packages should already be installed, so if anything wants to install
dependencies, bail out and ask the user first. Never run package installs
(e.g., `yarn install`, `npm install`, `pnpm install`). Always show the
screenshot in the response, even when the test fails, if `screenshot.png`
exists. Always include the full `test_catann.sh` output in the response
whether the test passes or fails.

## 1) Start the dev server (keep running for hot reloads)

```bash
cd /workspace/firegame/app/firegame
yarn start
```

Keep this command running for hot reloads. If the dev server is already up,
you can skip this step.

## 2) Run tests and capture output

In another shell:

```bash
cd /workspace/firegame/app
timeout 300s bash ./test_catann.sh --codex
```

If the timeout is hit, report it as a failure and proceed to collect the
screenshot (if available) for debugging.

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
python -m http.server -b 0.0.0.0 8000
```

## 5) Screenshot capture (browser tool / Playwright)

If a browser tool is available, open the hosted `screenshot.png` and include
it in the response. If no browser tool is available, still mention whether
`screenshot.png` was found and hosted.

## 6) Include `test_catann.sh` logs in final response

Always paste the full log output, even on success.
