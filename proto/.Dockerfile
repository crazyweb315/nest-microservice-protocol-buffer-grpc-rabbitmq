FROM node:22-alpine

# Install bash
RUN echo "Installing bash..." && apk add --no-cache bash git
RUN echo "Installing protoc globally..."

WORKDIR /app

# Copy all files
RUN echo "Copying files to /app..." 

COPY . .

# Install npm packages and run the compile script
RUN echo "Installing ts-proto packages..." && npm i -g ts-proto
RUN echo "Installing npm packages..." && npm i 
RUN apk add --no-cache protobuf protobuf-dev
RUN echo "Running compile.proto.sh..." && sh compile.proto.sh