/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const monorepoPackages = [
  path.resolve(workspaceRoot, 'mobile'),
  path.resolve(workspaceRoot, 'shared'),
]; // uncomment this line after adding packages and add it in watch folders
const projectNodeModules = path.resolve(projectRoot, 'node_modules');
const nodeModulesPaths = [path.resolve(workspaceRoot, 'node_modules')];

if (fs.existsSync(projectNodeModules)) {
  nodeModulesPaths.push(projectNodeModules);
}

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
      ...require('node-libs-react-native'),
      net: require.resolve('node-libs-react-native/mock/net'),
      tls: require.resolve('node-libs-react-native/mock/tls'),
    },
  },
  watchFolders: [__dirname, ...nodeModulesPaths, ...monorepoPackages],
};
