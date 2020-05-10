#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "must run as root"
  exit 1
fi

set -e
set -x
set -o pipefail

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# install jq
which jq || apt-get install -y jq

APP=$(jq -r .name "$DIR/package.json")

# install git submodules
(cd "$DIR" && git submodule update --init)

# install nodejs
which node || ( curl -sL https://deb.nodesource.com/setup_10.x | bash - && apt-get install -y nodejs )

if [ ! -d $DIR/node_modules ]; then
	(cd "$DIR" && npm install)
fi

which yarn || apt install -y yarn
(cd "$DIR/../" && npm install && yarn build)

# if [ ! -d $DIR/public/words ]; then
# 	tar -zxvf $DIR/public/words.tar.gz -C $DIR/public
# fi

SERVICE_SCRIPT=$DIR/service_script.sh

# server service
cat <<END > /etc/systemd/system/$APP.service
[Unit]
Description=starts $APP server
After=local-fs.target
Wants=local-fs.target

[Service]
ExecStart=/bin/bash $SERVICE_SCRIPT
Type=simple

[Install]
WantedBy=multi-user.target

END
systemctl daemon-reload
systemctl enable $APP
systemctl start $APP
