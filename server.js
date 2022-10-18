const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port=8080;
const CRUD = require("./CRUD-functions");
const sql = require('./db');
const connection = require('./db');
const { send } = require('process');
const cookieParser = require('cookie-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//routings
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req, res)=>{
   
   res.render('HomePage',{user: "Welcome back "+GetUser(req,res,"name")});
}); 
app.get('/Workout',(req, res)=>{
   res.render('Workout',{user: "Welcome, "+GetUser(req,res,"name")});
});
app.get('/HomePage',(req, res)=>{
   res.render('HomePage',{user: "Welcome, "+GetUser(req,res,"name")});
});
app.get('/Statistics',CRUD.PullStats);

app.post("/createNewClimber", CRUD.createNewClimber);
app.post("/Login", CRUD.Login);
app.post("/createNewRecords", CRUD.createNewRecords);
app.post("/FilterStats", CRUD.PullFilters);
    app.listen(port,()=>{
        console.log("Server is running on port"+port)
    });

    function GetUser(req,res,field){
      if (req.get("Cookie"))
      {
         var session = req.get("Cookie");
         console.log("Session is +"+session)
         var splitSession = session.split(/=|;/);
         var email = splitSession[1];
         var username = splitSession[3];
         console.log(email);
         console.log(username);
         if(field =="email") return email;
         if(field=="name") return username;
      }
      if(field =="email") return "Guest@Guest.Guest";
      if(field=="name") return "Guest";
      
     };
     module.exports = {GetUser};
   