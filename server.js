const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port=8080;
const sql = require('./db');
const connection = require('./db');
const CRUD = require("./CRUD-functions"); 
const { send } = require('process');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req, res)=>{
   res.redirect('VIEWS/HomePage.html');
});

app.post("/createNewClimber", CRUD.createNewClimber);
app.post("/Login", CRUD.Login);
app.post("/createNewRecords", CRUD.createNewRecords);



// simple route
/*
// Create a route for getting all customers
app.get('/customers',(req,res)=>{
 sql.query("SELECT * from customers",(err,mysqlres)=>{
    if (err)
     {
        console.log(err+"Error");
        res.status(400).send("Couldnt get the info");
        return;
     }
    console.log("got all customers");
    res.send(mysqlres);
    return;
 })
});
*/
    app.listen(port,()=>{
        console.log("Server is running on port"+port)
    });
    