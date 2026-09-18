const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    trace: 'retain-on-failure'
  },
  webServer: [
    {
      command: 'npm run dev -- --host localhost',
      cwd: '../bloglist-frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120000
    },
    {
      command: 'npm run start:test',
      cwd: '../../part4/bloglist',
      url: 'http://localhost:3003/api/blogs',
      reuseExistingServer: true,
      timeout: 120000
    }
  ]
})
