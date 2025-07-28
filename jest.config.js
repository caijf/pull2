/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('ts-jest').JestConfigWithTsJest} */
const { createDefaultPreset } = require('ts-jest');
const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/fileTransformer.js',
    // '\\.m?jsx?$': ['babel-jest', { plugins: ['@babel/plugin-transform-modules-commonjs'] }]
    '\\.m?jsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/tests/mocks/style-mock.ts'
  }
};
