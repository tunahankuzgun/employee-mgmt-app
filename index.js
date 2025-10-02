/**
 * Employee Management Application
 * Main entry point
 */

import './src/components/app-shell.js';
import {initI18n} from './src/utils/i18n.js';

console.log('Employee Management App - Starting...');

initI18n()
  .then(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#f5f5f5';
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = '<app-shell></app-shell>';
      console.log('App shell loaded successfully');
    } else {
      console.error('App container not found!');
    }
  })
  .catch((error) => {
    console.error('Failed to initialize i18n:', error);
  });
