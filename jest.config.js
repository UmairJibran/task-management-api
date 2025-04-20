module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**',
    '!src/migrations/**',
    '!src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 50,
      lines: 75,
      statements: 75,
    },
  },
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  verbose: true,
};
