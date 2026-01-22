# Skill: test_catann

Run the Catann Playwright test, capture the final screenshot, and use
persistent caches in Codex to speed up repeated runs.

## 0) Confirm location + this file
```bash
cd /workspace/firegame
printf "%s %s\n" "$(git rev-parse HEAD)" "/workspace/firegame/app/skills/test_catann.md"
```

## 1) Configure persistent caches (Codex sessions)
Use a shared cache directory that should persist between Codex sessions in the
Codex web UI. This caches npm downloads and Playwright browser binaries.
```bash
export CODEX_CACHE_DIR="/workspace/.codex_cache"
mkdir -p "${CODEX_CACHE_DIR}/npm" "${CODEX_CACHE_DIR}/ms-playwright"
export npm_config_cache="${CODEX_CACHE_DIR}/npm"
export PLAYWRIGHT_BROWSERS_PATH="${CODEX_CACHE_DIR}/ms-playwright"
```

## 2) Install dev deps (only if missing)
```bash
cd /workspace/firegame/app/firegame
if [ ! -d node_modules ]; then
  npm ci --prefer-offline
fi
```

## 3) Install Playwright browsers + OS deps
```bash
cd /workspace/firegame/app/firegame
npx playwright install
npx playwright install-deps
```

## 4) Run tests
```bash
cd /workspace/firegame/app
bash ./test_catann.sh
```

## 5) Locate output image
```bash
cd /workspace/firegame/app/firegame/test-results
ls
# pick the folder just created, then:
cd <test-results-subfolder>
ls
# expect: final-position.png
```

## 6) Host image locally
```bash
python -m http.server 8001
```

In another shell:
```bash
# 7) Validate URL returns 200
curl -I http://localhost:8001/final-position.png
curl http://localhost:8001/final-position.png -o /dev/null
```

## 8) Screenshot capture (browser tool / Playwright)
```python
# Use this with browser_container tool.
# NOTE: Keep the port 8001 and URL exactly as below.
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.firefox.launch()
        page = await browser.new_page(viewport={"width": 800, "height": 600})
        response = await page.goto('http://127.0.0.1:8001/final-position.png', wait_until='networkidle')
        status = response.status if response else 'no-response'
        print(f"status:{status}")  # should be 200
        await page.wait_for_timeout(1000)
        await page.screenshot(path='artifacts/final-position.png', full_page=True)
        await browser.close()

asyncio.run(main())
```

After screenshot:
```bash
# 9) Stop the server (Ctrl+C) and copy server logs into final response.
```

## Fix mode
If the prompt includes a `--fix` flag, fix the failing test and rerun it until
it passes, then continue with the screenshot steps.

## Notes
- Do not add yarn files or any lock files to the diff.
- If Chromium fails, retry with Firefox.
