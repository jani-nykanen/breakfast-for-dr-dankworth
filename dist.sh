#!/bin/sh
# Creates a distribution package

# Compile
tsc

# Remove existing distribution package
rm dist.zip

# Create package
zip -r dist.zip assets out.js style.css lib index.html
