#!/bin/bash

set -e
set -o pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

screen -Dm bash -c "set -x; pwd; cd "$DIR" npm start; sh"

iptables -A PREROUTING -t nat -p tcp --dport 80 -j REDIRECT --to-ports 8080
iptables -A PREROUTING -t nat -p tcp --dport 443 -j REDIRECT --to-ports 8080
