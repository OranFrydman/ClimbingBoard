const sql = require("./db");
var path = require("path");

const createNewClimber = (req, res) => {
  if (!req.body) {
    res.redirect("/CrushView?msg=" + encodeURIComponent("Content cannot be empty"));
    return;
  }

  sql.query(
    "SELECT * FROM climbers where email=?",
    req.body.UserEmail,
    (err, mysqlres) => {
      if (mysqlres.length == 0) {
        const NewClimber = {
          name: req.body.FullName,
          email: req.body.UserEmail,
          Password: req.body.Password,
        };
        console.log(NewClimber);
        sql.query("INSERT INTO climbers SET ?", NewClimber, (err, mysqlres) => {
          if (err) {
            console.log("ERROR: ", err);
            res.redirect("/CrushView?msg=" + encodeURIComponent("Error Creating the account: " + err));
            return;
          }
          console.log("New climber created");
          res.redirect("/CrushView?msg=" + encodeURIComponent("Welcome! We are so happy you decided to join us =] go back home, sign in and begin your workout progress"));
          return;
        });
      } else {
        res.redirect("/CrushView?msg=" + encodeURIComponent("Sorry, this email is already taken. We have yet to develop the feature to reset password please register with a new email"));
      }
    }
  );
};

const Login = (req, res) => {
  if (!req.body) {
    res.redirect("/CrushView?msg=" + encodeURIComponent("Content cannot be empty"));
    return;
  }
  const LoginInfo = {
    email: req.body.LoginUserEmail,
    Password: req.body.LoginPassword,
  };
  console.log(LoginInfo.Password);
  console.log(LoginInfo.email);
  sql.query(
    "SELECT * FROM climbers where email=? and password=?",
    [LoginInfo.email, LoginInfo.Password],
    (err, mysqlres) => {
      if (err) {
        res.redirect("/CrushView?msg=" + encodeURIComponent("Login Error: " + err));
        return;
      }
      if (mysqlres.length > 0) {
        console.log(mysqlres);

        // Redirect to home page
        console.log("Youre logged in");
        res.cookie("UserMail_C", LoginInfo.email, { httpOnly: true, path: "/" });
        res.cookie("UserName_C", mysqlres[0].name, { httpOnly: true, path: "/" });
        res.redirect("/HomePage");
      } else {
        res.redirect("/CrushView?msg=" + encodeURIComponent("Something went wrong, You used a wrong email or password. Go back home and try again"));
      }
    }
  );
};
const LogOut = (req, res) => {
  res.clearCookie("UserMail_C", { path: "/" });
  res.clearCookie("UserName_C", { path: "/" });
  res.redirect("/HomePage");
  console.log("You're logged out");
};
const createNewRecords = (req, res) => {
  // Validate required fields
  if (!req.body.TimeStamp || !req.body.ChosenLevel) {
    console.log("Missing required fields:", req.body);
    res.redirect("/CrushView?msg=" + encodeURIComponent("Error: Missing workout data (duration or level)"));
    return;
  }

  const level = convertLevel(req.body.ChosenLevel);
  if (!level) {
    console.log("Invalid level:", req.body.ChosenLevel);
    res.redirect("/CrushView?msg=" + encodeURIComponent("Error: Invalid difficulty level"));
    return;
  }

  const NewRecord = {
    email: GetUser(req, res, "email"),
    date: new Date(
      new Date(new Date(new Date()).toISOString()).getTime() -
        new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 19)
      .replace("T", " "),
    duration: req.body.TimeStamp,
    level: level,
  };
  console.log("Creating new record:", NewRecord);
  // sql.connect();
  sql.query("INSERT INTO stats SET ?", NewRecord, (err, mysqlres) => {
    if (err) {
      console.log("ERROR: ", err);
      res.redirect("/CrushView?msg=" + encodeURIComponent("Error Creating new Climb record: " + err));
      return;
    }
    console.log("New Record created");
    res.redirect("/Statistics");
    return;
  });
};
function convertLevel(num) {
  const levelNum = parseInt(num, 10);
  if (levelNum === 1) return "easy";
  if (levelNum === 2) return "medium";
  if (levelNum === 3) return "hard";
  return null; // invalid level
}
const PullStats = (req, res) => {
  let EmailQuery = GetUser(req, res, "email");
  console.log("Pulling stats with " + EmailQuery);
  sql.query(
    "SELECT ROW_NUMBER() OVER(ORDER BY date DESC) as num, DATE_FORMAT(date,'%Y/%m/%d - %H:%i:%S') as date, duration, level FROM stats WHERE email=? ORDER BY date DESC",
    EmailQuery,
    (err, data) => {
      if (err) {
        // Check if request wants JSON
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
          res.json({ error: "Error couldn't pull your climbs " + err });
          return;
        }
        res.redirect("/CrushView?msg=" + encodeURIComponent("Error couldn't pull your climbs: " + err));
        return;
      }

      console.log("pulling stats...");
      // Check if request wants JSON
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        res.json({ climbs: data });
        return;
      }
      res.redirect("/Statistics");
      return;
    }
  );
};
const PullFilters = (req, res) => {
  const body = req.body || {};
  // Build levels array: only include selected difficulties; if none selected, show all
  const levels = [];
  if (body.EasyFilter === "easy" || body.EasyFilter === "on") levels.push("easy");
  if (body.MediumFilter === "medium" || body.MediumFilter === "on") levels.push("medium");
  if (body.HardFilter === "hard" || body.HardFilter === "on") levels.push("hard");
  const levelList = levels.length > 0 ? levels : ["easy", "medium", "hard"];

  // Date range: full day for start and end (stats.date is DATETIME)
  const dateStart = (body.DateStart || "1995-01-01") + " 00:00:00";
  const dateFinish = (body.DateFinish || "2099-12-31") + " 23:59:59";

  const EmailQuery = GetUser(req, res, "email");
  const placeholders = levelList.map(() => "?").join(",");
  const sqlQuery = `SELECT ROW_NUMBER() OVER(ORDER BY date DESC) as num, DATE_FORMAT(date,'%Y/%m/%d - %H:%i:%S') as date, duration, level FROM stats WHERE email=? AND level IN (${placeholders}) AND date BETWEEN ? AND ? ORDER BY date DESC`;
  const params = [EmailQuery, ...levelList, dateStart, dateFinish];

  sql.query(sqlQuery, params, (err, data) => {
    if (err) {
      console.log("ERROR: ", err);
      if (req.headers.accept && req.headers.accept.includes("application/json")) {
        return res.json({ error: "Error couldn't pull your climbs " + err });
      }
      return res.redirect("/CrushView?msg=" + encodeURIComponent("Error couldn't pull your climbs: " + err));
    }
    console.log("pulling filter stats..success");
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({ climbs: data });
    }
    return res.redirect("/Statistics");
  });
};

const DeleteUser = (req, res) => {
  let EmailQuery = GetUser(req, res, "email");
  if (EmailQuery == "Guest@Guest.Guest") {
    res.redirect("/CrushView?msg=" + encodeURIComponent("You're Not logged in"));
    return;
  }

  sql.query("DELETE FROM stats WHERE email=?", EmailQuery, (err, data) => {
    if (err) {
      res.redirect("/CrushView?msg=" + encodeURIComponent("We couldn't delete this account's climbs: " + err));
      return;
    }
    res.redirect("/CrushView?msg=" + encodeURIComponent("All Climbs deleted successfully"));
  });
};

function GetUser(req, res, field) {
  if (req.get("Cookie")) {
    var session = req.get("Cookie");
    console.log("Session is +" + session);
    var splitSession = session.split(/=|;/);
    var email = splitSession[3];
    var username = splitSession[5];
    if (field == "email") return email;
    if (field == "name") return username;
  }
  if (field == "email") return "Guest@Guest.Guest";
  if (field == "name") return "Guest";
}
module.exports = {
  createNewClimber,
  Login,
  LogOut,
  createNewRecords,
  PullStats,
  PullFilters,
  DeleteUser,
};
