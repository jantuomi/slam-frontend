#!/bin/bash

set -euo pipefail
DIR="${1}"
VALID_ENV_KEYS=$(printenv | awk -F '=' '{ print $1 }' | tail | awk 'NF')

for f in $(find ${DIR} -regex '.*\.js'); do
  for envKey in ${VALID_ENV_KEYS}; do
    replaced=$(printenv ${envKey})
    sed -i "s|%${envKey}|${replaced}|g" "${f}"
    echo "[bootstrap] Replaced ${envKey} from container environment."
  done
done

nginx -g "daemon off;"
