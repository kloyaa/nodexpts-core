# Use a lightweight Node.js production image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (skipping dev dependencies)
RUN npm install --production

# Copy the compiled TypeScript code (dist folder) to the container
COPY dist ./dist

# Expose the port your application listens on (modify the port number if needed)
EXPOSE 3000

# Start your application when the container starts
CMD ["node", "dist/src/index.js"]