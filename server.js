// import some dependencies/ packages

// express framework - used for handling http requests
const express = require("express");

// create an instance of the framework
const app = express();

// create a DB
const mysql = require("mysql2");

// cross origin resource sharing
const cors = require("cors");

// environments variable
const dotenv = require("dotenv");
const { ifError } = require("assert");

app.use(express.json());
app.use(cors());
dotenv.config();

// connecting to the DB
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// check connection
db.connect((err) => {
  if (err) return console.log("Error connecting to Database!",err);
  console.log(`Connected to Database as id: ${db.threadId}`);
});

// get method code
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");




// listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)
})

//  Question 1 goes here
app.get("/data", (req, res) => {
  db.query("SELECT * FROM patients", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data");
    } else {
      // console.log(results);
      res.render("data", { results: results });
    }
  });
});

// Question 2 goes here
app.get("/providers", (req, res) => {
  db.query("SELECT * FROM providers", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data");
    } else {
      //   console.log(results);
      res.render("providers", { results: results });
    }
  });
});

// Question 3 goes here
app.get("/patient", (req, res) => {
  const firstName = req.query.first_name; // Get the first_name from query params

  if (!firstName) {
    return res.status(400).send("First Name is required");
  }

  const query = `SELECT * FROM patients WHERE first_name LIKE '%${firstName}%'`;

  db.query(query, [firstName], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving data");
    }

    res.render("patient", { results: results }); // Render results on the patients template
  });
});

// Question 4 goes here
app.get("/provider", (req, res) => {
  const specialty = req.query.specialty; // Get the specialty from query params

  if (!specialty) {
    return res.status(400).send("Specialty is required");
  }

  const query = "SELECT * FROM providers WHERE provider_specialty = ?";

  db.query(query, [specialty], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error retrieving data");
    }

    res.render("provider", { results: results }); // Render results on the providers template
  });
});

// stop get method code

// start server

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${process.env.PORT}`);

  // send message to browser
  console.log('Sending message to Browser');
  app.get("/", (req, res) => {
    res.send("Hello World");
  });
});