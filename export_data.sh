#! /bin/bash

URL="http://localhost:3000/export"
FORM_ID="clezfxfxx0005pllwqq2w0q22"

export $(grep -v '^#' .env | xargs)

curl -X POST "$URL" -H "Content-Type: application/json" -d "{\"mail\": \"sigbjorn.berdal14@gmail.com\", \"token\": \"$SESSION_SECRET\", \"form\": \"$FORM_ID\"}"