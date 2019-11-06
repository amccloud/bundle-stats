module.exports = {
  clearMocks: true,
  globals: {
    __VERSION__: '0.0.1',
  },
  setupFiles: [
    'core-js',
    '<rootDir>/build/jest/register-context.js',
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    'Fixtures/(.*)$': '<rootDir>/../../fixtures/$1',
    '@bundle-stats/(.*)/lib-esm': '@bundle-stats/$1/lib',
  },
  testEnvironment: 'node',
};