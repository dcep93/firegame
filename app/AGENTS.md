Confirm understanding by echoing the git SHA and the path to this file.

Requirements:
- Playwright is already installed; do not install it.
- Install dev dependencies before running run_test.sh.
- Do not include yarn files or any lock files in your diff.

Install prerequisites (estimated duration):
- npm ci (install dev dependencies) ~1 minute.
- npx playwright install (download browsers) ~2-4 minutes depending on network speed.
- npx playwright install-deps (system packages) ~3-6 minutes depending on apt speed.

run_test.sh:
- Takes about a minute to run.
- Generates an output image in /workspace/firegame/app/firegame/test-results.

After run_test.sh:
- Host the image locally with python -m http.server.
- Visit the correct path for the image.
- Take a screenshot of the hosted image.

When the user prompt is just "run_test":
- Treat it as a full run: prerequisites → run_test.sh → find the output image → host it → validate URL → take screenshot.
- One-shot screenshot workflow:
  1) cd into the test-results subfolder that contains the output image.
  2) Run `ls` to confirm the exact filename.
  3) Start `python -m http.server <port>` in that directory.
  4) Verify the exact URL returns 200 with `curl -I http://localhost:<port>/<filename>`.
  5) Capture a screenshot of that exact URL.
  6) Include the python server logs in the final response.
- If the browser tool fails with Chromium, retry with Firefox.
