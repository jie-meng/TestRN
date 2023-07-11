/**
 * @format
 */

import 'node-libs-react-native/globals';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import '@azure/core-asynciterator-polyfill';
import {AppRegistry} from 'react-native';
import App from './src/components/App';
import {name as appName} from './src/app.json';

AppRegistry.registerComponent(appName, () => App);
