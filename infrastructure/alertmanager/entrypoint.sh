#!/bin/sh
# Substitute environment variables in the config template using sed
sed -e "s|\${GMAIL_APP_PASSWORD}|${GMAIL_APP_PASSWORD}|g" \
    -e "s|\${GMAIL_FROM}|${GMAIL_FROM}|g" \
    -e "s|\${ALERT_EMAIL_TO}|${ALERT_EMAIL_TO}|g" \
    /etc/alertmanager/config.yml.template > /tmp/config.yml

# Start Alertmanager with the processed config
exec /bin/alertmanager --config.file=/tmp/config.yml "$@"
