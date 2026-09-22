export default {
  testEnvironment: "node",
  transform: {},
  verbose: true,
  testMatch: ["**/tests/**/*.test.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "utils/**/*.js",
    "middleware/**/*.js",
    "routes/**/*.js"
  ]
};
