/**
 * Employee Management Application
 * Main entry point
 */

import './src/components/app-shell.js';

console.log('Employee Management App - Starting...');

const appContainer = document.getElementById('app');
if (appContainer) {
  appContainer.innerHTML = '<app-shell></app-shell>';
  console.log('App shell loaded successfully');
} else {
  console.error('App container not found!');
}
