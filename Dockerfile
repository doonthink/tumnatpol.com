FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Force install (bypasses the strict npm ci lockfile issues)
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Expose the port Cloud Run expects
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
