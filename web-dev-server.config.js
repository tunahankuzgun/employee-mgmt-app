/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  plugins: [
    legacyPlugin({
      polyfills: {
        // Manually imported in index.html file
        webcomponents: false,
      },
    }),
  ],
  // SPA fallback - redirect all routes to index.html
  appIndex: 'index.html',
  // Middleware to handle SPA routing
  middleware: [
    function rewriteIndex(context, next) {
      if (
        context.url.indexOf('.') === -1 &&
        !context.url.startsWith('/node_modules')
      ) {
        context.url = '/index.html';
      }
      return next();
    },
  ],
};
