// Ensure Puppeteer cache dir is set early so Chromium can be installed/found on Render
process.env.PUPPETEER_CACHE_DIR = process.env.PUPPETEER_CACHE_DIR || "/tmp/puppeteer";

require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();
app.listen(3000, () => {
  console.log("Server is running on PORT 3000");
});
