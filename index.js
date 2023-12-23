// only require it once in index.js, but make sure it is required before any files that uses .env variables
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
