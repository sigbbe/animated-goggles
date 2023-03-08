#! /bin/bash

psql -d postgres --user=postgres -c "\copy \"$1\" FROM '$2'"