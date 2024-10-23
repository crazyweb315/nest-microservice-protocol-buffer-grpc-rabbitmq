# Stage 1: Build the proto files
FROM node:22-alpine AS proto-builder

USER root

RUN echo "Installing bash..." && apk add --no-cache bash git
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

# Set the working directory for the final image
WORKDIR /app

# Copy the proto build from the previous stage
COPY --from=proto-builder /app/proto /app/proto

# Copy the micro_account service files
COPY ./micro_account /app

#Copy the prisma directory
COPY ./prisma /app/prisma  

# Set the working directory to micro_account
WORKDIR /app

# Clean up old files and prepare the environment
RUN rm -rf /app/proto/node_modules # Remove node modules in proto

RUN echo "Installing global packages..." && npm i -g @nestjs/cli prisma 
RUN npm install
RUN echo "Generating prisma schema..." && prisma generate  # Generate Prisma client
# Install dependencies for micro_account


# Expose the required port
EXPOSE 5000  

# Start the microservice
CMD ["npm", "run", "start:dev"]