#!/bin/bash

echo "<pre>"
systemctl restart firegame
code=$?
echo "$(date) $code restarted"
echo "</pre>"
echo
