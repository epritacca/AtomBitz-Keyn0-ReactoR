const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 15000,
  use: {
    baseURL: "http://127.0.0.1:5177",
    viewport: { width: 1440, height: 1100 },
  },
  webServer: {
    command: "python -m http.server 5177 --bind 127.0.0.1",
    url: "http://127.0.0.1:5177",
    reuseExistingServer: true,
    timeout: 10000,
  },
});
