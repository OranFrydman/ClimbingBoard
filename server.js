const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port=8080;
const sql = require('./db');
const connection = require('./db');
const CRUD = require("./CRUD-functions"); 
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
   res.render('HomePage');
});
app.get('/HomePage',(req, res)=>{
   if (req.get("Cookie"))
   {
      var session = req.get("Cookie");
      console.log("Session is +"+session)
      var splitSession = session.split("=",";");
      var email = splitSession[1];
      console.log(email);
   }
   res.render('HomePage.html',{title: 'Home',})
   
});
app.get('/Workout',(req, res)=>{
   res.render('Workout.html',{title: 'Workout Session'})
});
app.get('/statistics',(req, res)=>{
   res.render('statistics.html',{title: 'Results'})
});

app.post("/createNewClimber", CRUD.createNewClimber);
app.post("/Login", CRUD.Login);
app.post("/createNewRecords", CRUD.createNewRecords);



    app.listen(port,()=>{
        console.log("Server is running on port"+port)
    });
    
  