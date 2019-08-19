#!/bin/bash
find  $HOME -path "*/.*" -prune -o -type d -exec sh -c 'cd "$1" && [ -d docker -a -e docker/build.sh -a -d include -a -e kuksa.yaml -a -e src ]' -- {} \; -print 