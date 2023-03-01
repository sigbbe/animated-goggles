#! /bin/bash

URL="http://localhost:3000/export"
SESSION_SECRET="e7bca475961f8a32926b5bc586f52db7"

curl -X POST $URL -H "Content-Type: application/json" -d "{\"mail\": \"sigbjorn.berdal14@gmail.com\", \"token\": \"$SESSION_SECRET\"}"