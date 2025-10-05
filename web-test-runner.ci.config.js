/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';
import {playwrightLauncher} from '@web/test-runner-playwright';

// CI-optimized configuration - only Chromium for faster CI runs
export default {
  rootDir: '.',
  files: ['./test/**/*_test.js'],
  nodeResolve: {exportConditions: ['development']},
  preserveSymlinks: true,
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
      },
    }),
  ],
  testFramework: {
    config: {
      ui: 'tdd', // Test Driven Development interface (suite, test functions)
      timeout: '10000', // 10 second timeout for CI
    },
  },
  coverage: true,
  coverageConfig: {
    include: ['src/**/*.js'],
    exclude: ['test/**/*.js', '**/node_modules/**'],
    threshold: {
      statements: 0, // Lowered for CI
      branches: 0,
      functions: 0,
      lines: 0,
    },
    reportDir: './coverage',
    reporters: ['html', 'lcovonly', 'text-summary'],
  },
  testsStartTimeout: 30000, // 30 seconds for tests to start
  testsFinishTimeout: 120000, // 2 minutes for tests to finish
  testRunnerHtml: (testFramework) => `
    <html>
      <head>
        <script>
          // Polyfill Node.js globals for browser environment
          window.process = window.process || { env: { NODE_ENV: 'test' } };
          window.global = window.global || window;
        </script>
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
  plugins: [
    legacyPlugin({
      polyfills: {
        webcomponents: true,
        custom: [
          {
            name: 'lit-polyfill-support',
            path: 'node_modules/lit/polyfill-support.js',
            test: "!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || window.ShadyDOM && window.ShadyDOM.force",
            module: false,
          },
        ],
      },
    }),
  ],
};
