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
