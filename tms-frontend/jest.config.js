const nextJest = require("next/jest");
const { compilerOptions } = require("./tsconfig.json");

const createJestConfig = nextJest({
  dir: "./",
});

const aliasMapper = Object.keys(compilerOptions.paths).reduce((acc, key) => {
  const alias = `^${key.replace("/*", "/(.*)")}$`;
  const path = `<rootDir>/${compilerOptions.paths[key][0].replace(
    "/*",
    "/$1"
  )}`;
  acc[alias] = path;
  return acc;
}, {});

const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: aliasMapper,
};

module.exports = createJestConfig(customJestConfig);
