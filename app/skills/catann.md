# Skill: test_catann

Packages should already be installed, so bail out instead of installing
anything. Always show the screenshot in the response—even when the test
fails—if `screenshot.png` exists. Always include the full `test_catann.sh`
output in the response whether the test passes or fails.

## 1) Start the dev server. Keep this running for hot reloads.

```bash
cd /workspace/firegame/app/firegame
yarn start
```

Keep this command running for hot reloads. If the dev server is already up,
you can skip this step.

## 2) Run tests, storing the output

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

## 3) Locate output image

```bash
cd /workspace/firegame/app/firegame/test-results
ls
# pick the folder just created, then:
cd <test-results-subfolder>
ls
# expect: screenshot.png
```

## 4) Host image locally

```bash
python -m http.server -b 0.0.0.0 8000
```

## 5) Screenshot capture (browser tool / Playwright)

## 6) Include test_catann.sh logs into final response.
