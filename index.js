const express = require("express");
const mysql = require("mysql2");
const createConnection = require("./config/db");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
// const createUserTable = require("./models/user");
// const createDb = require("./models/createDb");
// const selectDb = require("./models/selectDb");
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const databaseName = "myDB";

const setUpDb = async () => {
  try {
    const connection = await createConnection;
    // await createDb(databaseName);
    // await selectDb(databaseName);
    // await createUserTable(databaseName);
    console.log("database setup complete");
  } catch (error) {
    console.log("Error setting up database", error);
  }
};
setUpDb();

app.get("/", (req, res) => {
  res.redirect("/create.html");
});

app.get("/delete-data", async (req, res) => {
  const connection = await createConnection;
  const deleteQuery = `delete from users where id=?`;
  connection.query(deleteQuery, [req.query.id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("row deleted");
      res.redirect("/data");
    }
  });
});

app.get("/data", async (req, res) => {
  const connection = await createConnection;
  const insertQuery = `select * from users`;
  connection.query(insertQuery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render("read.ejs", { result });
    }
  });
});

app.get("/update-data", async (req, res) => {
  const connection = await createConnection;
  const updateQuery = `select * from users where id=?`;
  connection.query(updateQuery, req.query.id, (err, eachRow) => {
    if (err) {
      console.log(err);
    } else {
      result = JSON.parse(JSON.stringify(eachRow[0]));
      console.log(result);
      res.render("edit.ejs", { result });
    }
  });
});

app.post("/update", async (req, res) => {
  const id = req.body.hidden_id;
  const username = req.body.name;
  const email = req.body.email;

  try {
    const connection = await createConnection;
    const updtaeQuery = `update users set username=?, email=? where id=? `;
    connection.query(updtaeQuery, [username, email, id], (error, results) => {
      if (error) {
        console.log("Error inserting data:", error);
        res.status(500).send("Error inserting data");
      } else {
        console.log("Data updated successfully");
        res.redirect("/data");
      }
      // Close the connection
      // connection.end();
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/create", async (req, res) => {
  console.log(req.body);
  const username = req.body.name;
  const email = req.body.email;

  try {
    const connection = await createConnection;
    const insertQuery = `INSERT INTO users (username, email) VALUES (?, ?)`;
    connection.query(insertQuery, [username, email], (error, results) => {
      if (error) {
        console.log("Error inserting data:", error);
        res.status(500).send("Error inserting data");
      } else {
        console.log("Data inserted successfully");
        res.redirect("/data");
      }

      // Close the connection
      // connection.end();
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server is running on port ${process.env.PORT}`);
  }
});
