# Stage 1: Build the proto files
FROM node:22-alpine AS proto-builder

USER root

RUN echo "Installing bash..." && apk add --no-cache bash

RUN echo "Installing protoc globally..."

# Set the working directory
WORKDIR /app

# Copy the proto directory to the builder context
COPY ./proto /app/proto

# Install any dependencies for proto (if needed) and build
RUN echo "Installing ts-proto packages..." && npm i -g ts-proto
RUN apk add --no-cache protobuf protobuf-dev
RUN echo "Running compile.proto.sh..." && cd proto && sh compile.proto.sh

# Stage 2: Build the micro_account service
FROM node:22-alpine

RUN echo "Installing grpcurl..." && apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing grpcurl
RUN echo "Installing mongo..." 
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/main' >> /etc/apk/repositories
RUN echo 'http://dl-cdn.alpinelinux.org/alpine/v3.9/community' >> /etc/apk/repositories
RUN apk update && apk add --no-cache mongodb mongodb-tools

# Set the working directory for the final image
WORKDIR /app

# Copy the proto build from the previous stage
COPY --from=proto-builder /app/proto /app/proto

# Copy the micro_account service files
COPY ./micro_account /app

#Copy the prisma directory
COPY ./prisma /app/prisma  

# Clean up old files and prepare the environment
RUN rm -rf /app/proto/node_modules # Remove node modules in proto

RUN echo "Installing global nestjs/cli packages..." && npm i -g @nestjs/cli
RUN echo "Installing global prisma packages..." && npm i -g prisma 
RUN npm install
RUN echo "Generating prisma schema..." && prisma generate  # Generate Prisma client
# Install dependencies for micro_account
RUN echo "schema generation completed"

# Expose the required port
EXPOSE 5000  

# Start the microservice
RUN echo "Starting micro service"

CMD ["npm", "run", "start:dev"]