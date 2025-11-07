// Test Setup - Configure testing environment for server

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

// Cleanup after all tests
afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
  await mongoose.disconnect();
});

// Mock console methods to reduce test noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
