const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;
const sql = require("./db/db");
const CRUD = require("./db/CRUD-Functions");
const cookieParser = require("cookie-parser");
const CreateDB = require("./db/CreateDB");
const fs = require("fs");
const stringify = require("csv-stringify").stringify;
const { parse } = require("csv-parse");
const CSVToJSON = require("csvtojson");
const BASE_URL = process.env.BASE_URL || "http://localhost:8888";
process.env.NODE_ENV = "production";

app.get("/CreateTable_Users", CreateDB.CreateTable_Users);
app.get("/CreateTable_Stats", CreateDB.CreateTable_Stats);

app.get("/InsertData_Users", CreateDB.InsertData_Users);
app.get("/InsertData_Stats", CreateDB.InsertData_Stats);

app.get("/ShowTable_Users", CreateDB.ShowTable_Users);
app.get("/ShowTable_Stats", CreateDB.ShowTable_Stats);

app.get("/DropTable_Users", CreateDB.DropTable_Users);
app.get("/DropTable_Stats", CreateDB.DropTable_Stats);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
// app.engine('html',require('pug').renderFile); // Debug
app.set("views", path.join(__dirname, "VIEWS"));
app.set("view engine", "pug");
//routings
app.use(express.static(path.join(__dirname, "public")));
console.log("Views directory:", path.join(__dirname, "VIEWS")); //Debug
console.log(
  "Files in views directory:",
  fs.readdirSync(path.join(__dirname, "VIEWS"))
); //Debug
app.get("/", (req, res) => {
  console.log("Current user is" + GetUser(req, res, "name")); // Debug
  res.render("HomePage", { user: "Welcome back " + GetUser(req, res, "name") }); // Fail on this line
});

app.get("/Workout", (req, res) => {
  res.render("Workout", { user: "Welcome, " + GetUser(req, res, "name") });
});
app.get("/HomePage", (req, res) => {
  res.render("HomePage", { user: "Welcome, " + GetUser(req, res, "name") });
});
app.get("/LogOut", CRUD.LogOut);
app.get("/Statistics", CRUD.PullStats);
app.get("/Delete", CRUD.DeleteUser);
app.post("/createNewClimber", CRUD.createNewClimber);
app.post("/Login", CRUD.Login);
app.post("/createNewRecords", CRUD.createNewRecords);
app.post("/FilterStats", CRUD.PullFilters);

app.listen(port, () => {
  console.log("Server is running on port - " + port);
});

function GetUser(req, res, field) {
  if (req.get("Cookie")) {
    var session = req.get("Cookie");
    console.log("Session is +" + session);
    var splitSession = session.split(/=|;/);
    var email = splitSession[3];
    var username = splitSession[5];
    console.log("Split Sess is " + splitSession);
    console.log("Email in Session is " + email);
    console.log("User in Session is " + username);
    if (field == "email") return email;
    if (field == "name") return username;
  }
  if (field == "email") return "Guest@Guest.Guest";
  if (field == "name") return "Guest";
}
