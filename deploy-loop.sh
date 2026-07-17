#!/bin/bash
export PATH=/home/kidss/.local/bin:/usr/local/bin:/usr/bin:/bin
cd /home/kidss/Midnight

echo "Starting deployment loop script..."

while true; do
  MIDNIGHT_SYNC_TIMEOUT_MS=7200000 NODE_OPTIONS='--max-old-space-size=8192' yarn --cwd auction-deploy deploy --network preprod
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo "=============================================="
    echo "   DEPLOYMENT FINISHED SUCCESSFULLY! Exiting."
    echo "=============================================="
    exit 0
  else
    echo "=============================================="
    echo "   Deploy script exited with code $EXIT_CODE."
    echo "   Restarting in 5 seconds to resume from state..."
    echo "=============================================="
    sleep 5
  fi
done
