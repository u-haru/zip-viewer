/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.test.json' },
    ],
  },
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    'virtual:pwa-register': '<rootDir>/tests/mocks/pwaRegister.ts',
  },
};
