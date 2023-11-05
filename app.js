const express = require("express");
const app = express();
app.use(express.json());

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const bcrypt = require("bcrypt");

const path = require("path");

const dbPath = path.join(__dirname, "userData.db");
let db = null;
const initializeServerAndDb = async () => {
  try {
    db = await open({
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
app.post("/register/", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashPassword = await bcrypt.hash(password, 10);
  let newUser = undefined;
  const newUserQuery = `
        select * 
        from user
        where username = ${username};`;
  newUser = await db.get(newUserQuery);

  if (newUser !== undefined) {
    const registerInsertQuery = `
    INSERT INTO
    user (username,name, password ,gender, location)
    values(
        ${username}
        ${name}
        ${hashPassword}
        ${gender}
        ${location}
    )`;
    const registerInsert = await db.run(registerInsertQuery);
    response.send("register successed");
  } else {
    response.status(400);
    response.send("user Already exist");
  }
});
