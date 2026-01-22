# Skill: test_catann

Run the Catann Playwright test with a 5-minute timeout, capture the final
screenshot, and use persistent caches in Codex to speed up repeated runs.
Packages should already be installed, so bail out instead of installing
anything. Always show the screenshot in the response—even when the test
fails—if `screenshot.png` exists. Always include the full `test_catann.sh`
output in the response whether the test passes or fails. This skill should
ensure the dev server is running (starting `yarn start` if it is not), and it
keeps the dev server running for hot reloads.

## 1) Start the dev server (keep this running)

```bash
cd /workspace/firegame/app
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
python -m http.server 8001
```

## 5) Validate URL returns 200

In another shell:

```bash
curl -I http://localhost:8001/screenshot.png
curl http://localhost:8001/screenshot.png -o /dev/null
```

## 6) Screenshot capture (browser tool / Playwright)

```python
# Use this with browser_container tool.
# NOTE: Keep the port 8001 and URL exactly as below.
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.firefox.launch()
        page = await browser.new_page(viewport={"width": 800, "height": 600})
        response = await page.goto('http://127.0.0.1:8001/screenshot.png', wait_until='networkidle')
        status = response.status if response else 'no-response'
        print(f"status:{status}")  # should be 200
        await page.wait_for_timeout(1000)
        await page.screenshot(path='artifacts/screenshot.png', full_page=True)
        await browser.close()

asyncio.run(main())
```

After screenshot:

# 7) Stop the server (Ctrl+C) and test_catann.sh logs into final response.

## Fix mode

If the prompt explicitly requests, fix the failing test and rerun it until
it passes, then continue with the screenshot steps.

## 8) Attach the screenshot (always, if it exists)

If `screenshot.png` exists, attach it in the response even on failure using the
image tool, e.g.:

```json
{
  "path": "/workspace/firegame/app/firegame/test-results/<test-results-subfolder>/screenshot.png"
}
```
