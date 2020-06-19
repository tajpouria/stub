module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/.jest/env.ts', '<rootDir>/src/.jest/utils.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/.jest/mongo.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
};
