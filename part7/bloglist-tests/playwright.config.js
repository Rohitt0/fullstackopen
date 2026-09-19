import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  webServer: [
    {
      command: 'node index.js',
      cwd: '../bloglist/backend',
      url: 'http://localhost:3003/api/blogs',
      env: {
        NODE_ENV: 'test'
      },
      reuseExistingServer: !process.env.CI
    },
    {
      command: 'node node_modules/vite/bin/vite.js',
      cwd: '../bloglist/frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI
    }
  ]
})