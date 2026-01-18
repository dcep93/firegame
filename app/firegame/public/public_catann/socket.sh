#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCOOKIE="$(cat "$SCRIPT_DIR/cookies.txt")"
WEBSOCAT_BIN="${WEBSOCAT_BIN:-websocat}"
SOURCE_URL="${SOCKET_SOURCE_URL:-https://colonist.io}"
SOCKET_SERVER_WSS="${SOCKET_SERVER_WSS:-}"
SOCKET_VERSION_OVERRIDE="${SOCKET_VERSION_OVERRIDE:-}"
SOCKET_FIRST_USER_SESSION_ID="${SOCKET_FIRST_USER_SESSION_ID:-07F81D.13885405}"
SOCKET_TURNSTILE_TOKEN="${SOCKET_TURNSTILE_TOKEN:-}"

proxychains_cmd=()
proxy_url="${SOCKET_HTTP_PROXY:-${HTTPS_PROXY:-${HTTP_PROXY:-}}}"

if [[ -n "${proxy_url}" ]] && command -v proxychains4 >/dev/null; then
  proxy_host_port="${proxy_url#*://}"
  proxy_host_port="${proxy_host_port%%/*}"
  proxy_host="${proxy_host_port%%:*}"
  proxy_port="${proxy_host_port##*:}"

  if [[ ! "$proxy_host" =~ ^[0-9]+(\.[0-9]+){3}$ ]]; then
    proxy_host="$(getent hosts "$proxy_host" | awk 'NR==1 {print $1}')"
  fi

  proxy_conf="$(mktemp)"
  trap 'rm -f "$proxy_conf"' EXIT

  cat >"$proxy_conf" <<EOF
strict_chain
proxy_dns
[ProxyList]
http ${proxy_host} ${proxy_port}
EOF

  proxychains_cmd=(proxychains4 -q -f "$proxy_conf")
fi

${proxychains_cmd[@]+"${proxychains_cmd[@]}"} "$WEBSOCAT_BIN" -v -n \
  -H="Origin: https://colonist.io" \
  -H="User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36" \
  -H="Cookie: $SCOOKIE" \
  "$(bash -c '
    set -euo pipefail
    source_url="$1"
    html="$(curl -fsSL "$source_url")"
    socket_server_override="$2"
    version_override="$3"
    first_user_session_id="$4"
    turnstile_token="$5"
    socket_server="$(printf "%s" "$html" | sed -n "s/.*socketServerWSS=\"\\([^\"]*\\)\".*/\\1/p" | head -n 1)"
    version_number="$(printf "%s" "$html" | sed -n "s/.*versionNumber= \\([0-9]*\\).*/\\1/p" | head -n 1)"

    if [[ -n "$socket_server_override" ]]; then
      socket_server="$socket_server_override"
    elif [[ -z "$socket_server" ]]; then
      socket_server="wss://socket.svr.colonist.io/"
    fi

    if [[ -n "$version_override" ]]; then
      version_number="$version_override"
    fi

    if [[ -n "$version_number" ]]; then
      query="version=$version_number"
    else
      query="version=2"
    fi

    if [[ -n "$first_user_session_id" ]]; then
      query="${query}&firstUserSessionId=${first_user_session_id}"
    fi

    if [[ -n "$turnstile_token" ]]; then
      query="${query}&turnstileToken=${turnstile_token}"
    fi

    printf "%s?%s" "$socket_server" "$query"
  ' bash "$SOURCE_URL" "$SOCKET_SERVER_WSS" "$SOCKET_VERSION_OVERRIDE" "$SOCKET_FIRST_USER_SESSION_ID" "$SOCKET_TURNSTILE_TOKEN")"
