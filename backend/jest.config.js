module.exports = {
  // Entorno de testing
  testEnvironment: 'node',
  
  // Directorios de tests
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/uploads/'
  ],
  
  // Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/db/migrations/**',
    '!src/db/seeders/**',
    '!src/index.js'
  ],
  
  // Setup
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Timeout
  testTimeout: 10000,
  
  // Variables de entorno para testing
  setupFiles: ['<rootDir>/tests/env.setup.js']
};