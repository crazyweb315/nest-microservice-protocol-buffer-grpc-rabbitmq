#!/bin/sh

# Ensure protoc is accessible
command -v protoc >/dev/null 2>&1 || { echo >&2 "protoc is not installed. Exiting."; exit 1; }

# Your protoc command goes here
protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd \
  --ts_proto_out=./build *.proto \
  --ts_proto_opt=nestJs=true \
  --ts_proto_opt=fileSuffix=.pb