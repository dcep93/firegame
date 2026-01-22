# Skill: test_catann

Run the Catann Playwright test, capture the final screenshot, and use
persistent caches in Codex to speed up repeated runs. Packages should already be installed, bail out instead of installing anything.

## 1) Run tests

```bash
cd /workspace/firegame/app
bash ./test_catann.sh
```

## 2) Locate output image

```bash
cd /workspace/firegame/app/firegame/test-results
ls
# pick the folder just created, then:
cd <test-results-subfolder>
ls
# expect: screenshot.png
```

## 3) Host image locally

```bash
python -m http.server 8001
```

# 4) Validate URL returns 200

In another shell:

```bash
curl -I http://localhost:8001/screenshot.png
curl http://localhost:8001/screenshot.png -o /dev/null
```

## 5) Screenshot capture (browser tool / Playwright)

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

# 6) Stop the server (Ctrl+C) and copy server logs into final response.

## Fix mode

If the prompt includes a `--fix` flag, fix the failing test and rerun it until
it passes, then continue with the screenshot steps.
If `--fix` is not provided, still continue with the screenshot steps.
