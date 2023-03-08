#! /bin/bash

URL="http://localhost:3000/form/create"

curl -X POST $URL -H "Content-Type: application/json" -d @$1