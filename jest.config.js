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
      branches: 13,
      functions: 13,
      lines: 13,
      statements: 13,
    },
  },
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  verbose: true,
};
