npx protoc \
--plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd \
--ts_proto_out=./build  *.proto \
--ts_proto_opt=nestJs=true \
--ts_proto_opt=fileSuffix=.pb