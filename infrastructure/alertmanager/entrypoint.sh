#!/bin/sh
# Substitute environment variables in the config template
envsubst < /etc/alertmanager/config.yml.template > /etc/alertmanager/config.yml

# Start Alertmanager with the processed config
exec /bin/alertmanager "$@"
