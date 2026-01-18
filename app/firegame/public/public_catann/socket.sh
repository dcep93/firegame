SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCOOKIE="$(cat "$SCRIPT_DIR/cookies.txt")"
websocat -v \
  -H "Origin: https://colonist.io" \
  -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36" \
  -H "Cookie: $SCOOKIE" \
  "wss://socket.svr.colonist.io/?version=2"
