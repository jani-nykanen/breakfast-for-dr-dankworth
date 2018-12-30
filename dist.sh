#!/bin/sh
# Creates a distribution package

# Compile
tsc

# Remove existing distribution package
rm dist.tar.gz

# Create package
tar -zcvf dist.tar.gz assets out.js style.css index.html
