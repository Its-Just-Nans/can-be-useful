const { _electron: electron } = require('playwright')
const { test } = require('@playwright/test')

test('launch app', async () => {
  const electronApp = await electron.launch({ args: ['../main.js'] })
  // close app
  await electronApp.close()
});