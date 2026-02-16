const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
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

app.use(cookieParser());

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

// Serve React app static files from dist directory FIRST (so bundle.js is served from dist)
app.use(express.static(path.join(__dirname, "dist")));

// Serve static files from public directory (for media) - but exclude index.html
app.use('/MEDIA', express.static(path.join(__dirname, "public", "MEDIA")));
app.use('/static', express.static(path.join(__dirname, "public", "static")));

// API Routes (before React routes)
app.get("/CreateTable_Users", CreateDB.CreateTable_Users);
app.get("/CreateTable_Stats", CreateDB.CreateTable_Stats);
app.get("/InsertData_Users", CreateDB.InsertData_Users);
app.get("/InsertData_Stats", CreateDB.InsertData_Stats);
app.get("/ShowTable_Users", CreateDB.ShowTable_Users);
app.get("/ShowTable_Stats", CreateDB.ShowTable_Stats);
app.get("/DropTable_Users", CreateDB.DropTable_Users);
app.get("/DropTable_Stats", CreateDB.DropTable_Stats);

app.get("/LogOut", CRUD.LogOut);
// Do NOT add app.get("/Statistics", ...) - let the React app handle /Statistics and fetch data via /api/statistics
// Serve board config JSON from source – always fresh, no rebuild needed
app.get("/api/board/:id", (req, res) => {
  const id = req.params.id;
  const safeId = id.replace(/[^a-z0-9]/gi, "");
  const filePath = path.join(__dirname, "src", "data", "boards", `${safeId}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Board not found" });
  res.sendFile(filePath, { headers: { "Content-Type": "application/json" } });
});

app.get("/api/statistics", (req, res) => {
  req.headers.accept = 'application/json';
  CRUD.PullStats(req, res);
});
app.get("/Delete", CRUD.DeleteUser);
app.post("/createNewClimber", CRUD.createNewClimber);
app.post("/Login", CRUD.Login);
app.post("/createNewRecords", CRUD.createNewRecords);
app.post("/FilterStats", CRUD.PullFilters);
app.post("/api/filterStats", (req, res) => {
  req.headers.accept = 'application/json';
  CRUD.PullFilters(req, res);
});

// Serve React app for all other routes (must be last)
app.get("*", (req, res) => {
  // Only serve index.html for routes that don't have file extensions
  // Static files (js, css, images) are handled by express.static above
  const hasExtension = /\.\w+$/.test(req.path);
  if (hasExtension) {
    return res.status(404).send('File not found');
  }
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log("Server is running on port - " + port);
});
