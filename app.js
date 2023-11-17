const express = require("express");
const app = express();
app.use(express.json());

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

// sample API get method and sample path

//API 1
app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;

  const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
  const selectUser = await db.get(selectUserQuery);

  if (selectUser === undefined) {
    if (password.length > 5) {
      const hasedPassword = bcrypt.hash(password, 10);
      const registerPostQuery = `
        insert into user
        (username, name, password, gender, location)
        values (?,?,?,?,? )
        `;
      const registerPost = await db.run(registerPostQuery, [
        username,
        name,
        hasedPassword,
        gender,
        location,
      ]);
      response.send("User created successfully");
    } else {
      response.status(400).send("Password is too short");
    }
  } else {
    response.status(400).send("User already exists");
  }
});

// API 2 path //login/
// method post

app.post("/login/", async (request, response) => {
  const { username } = request.body;
  const { password } = request.body;
  let findUser = undefined;
  const findUserQuery = `
  select * 
  from user
  where username = ?;
  `;
  findUser = await db.get(findUserQuery, [username]);

  if (findUser === undefined) {
    response.status(400).send("Invalid user");
  } else {
    const truePassword = await bcrypt.compare(password, findUser.password);
    if (truePassword === true) {
      const payload = {
        username: username,
      };
      const jwtoken = await jwt.sign(payload, "my_sectret_key");
      response.send({ jwtoken });
    } else {
      response.status(400).send("Invalid password");
    }
  }
});
