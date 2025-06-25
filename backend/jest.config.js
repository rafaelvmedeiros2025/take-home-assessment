// jest.config.js
module.exports = {
  testEnvironment: "node", // Use Node environment (no browser)
  testMatch: ["**/__tests__/**/*.test.js"], // Look for test files in __tests__ folder ending with .test.js
  verbose: true, // Show individual test results
  clearMocks: true, // Automatically clear mocks between tests
  coverageDirectory: "coverage", // Output coverage reports here
  collectCoverageFrom: [
    "src/**/*.js", // Collect coverage from your source files
    "!src/**/index.js", // Ignore index files if you want
  ],
  moduleFileExtensions: ["js", "json", "node"],
  // If you use Babel, add transform config here (optional)
};
