const express = require("express");
const app = express();
app.use(express.json());

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const path = require("path");

const dbPath = path.join(__dirname, "userData.db");

const initializeServerAndDb = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("server 4000 is starting .......");
    });
  } catch (e) {
    process.exit(1);
  }
};
initializeServerAndDb();

//API 1
app.get("/all/", (request, response) => {
  response.send("hello");
});
