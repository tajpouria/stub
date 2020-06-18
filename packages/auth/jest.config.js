module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/.jest/env.ts'],
  setupFilesAfterEnv: ['<rootDir>/.jest/mongo.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
};
