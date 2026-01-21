# One-shot run_test

Use this file when the prompt is exactly: run_test

```bash
# 0) Confirm location + this file
cd /workspace/firegame
printf "%s %s\n" "$(git rev-parse HEAD)" "/workspace/firegame/app/AGENTS.md"

# 1) Install dev deps (must happen before run_test.sh)
cd /workspace/firegame/app/firegame
npm ci

# 2) Install Playwright browsers + OS deps (Playwright is already installed)
#    - do NOT install playwright itself
npx playwright install
npx playwright install-deps

# 3) Run tests
cd /workspace/firegame/app
bash ./run_test.sh

# 4) Locate output image
cd /workspace/firegame/app/firegame/test-results
ls
# pick the folder just created, then:
cd <test-results-subfolder>
ls
# expect: screenshot.png

# 5) Host image locally
python -m http.server 8001
```

In another shell:

```bash
# 6) Validate URL returns 200
curl -I http://localhost:8001/screenshot.png
curl http://localhost:8001/screenshot.png -o /dev/null
```

Screenshot capture (browser tool / Playwright):

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
        await page.screenshot(path='artifacts/final-position.png', full_page=True)
        await browser.close()

asyncio.run(main())
```

After screenshot:

```bash
# 7) Stop the server (Ctrl+C) and copy server logs into final response.
```

Notes:
- Do not add yarn files or any lock files to the diff.
- If Chromium fails, retry with Firefox.
