/**
 * Jest configuration for React testing environment.
 * Uses 'jsdom' to simulate browser-like environment for DOM APIs.
 */
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  // Add other Jest configs here if needed, e.g., coverage, setupFiles, etc.
};
