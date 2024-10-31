const express = require("express");
const app = express();

const PORT = process.env.PORT || 4001;

app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

app.listen(PORT, () => {
  console.log(`The server is listening on port ${PORT}`);
});
