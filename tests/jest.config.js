module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jsonpath-plus)/)'
  ],
  collectCoverageFrom: [
    '../dist/levels.js',
    '../dist/game.js'
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
