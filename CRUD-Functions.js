const sql = require('./db');
var path = require('path');
const e = require('express');




const createNewClimber = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "content cannot be empty"});
        return;
    }

    
    sql.query("SELECT * FROM climbers where email=?",req.body.UserEmail,(err,mysqlres)=>{ 
        if(mysqlres.length==0)
            {
                const NewClimber = {
                    "name": req.body.FullName,
                    "email": req.body.UserEmail,
                    "Password": req.body.Password
                };
                console.log(NewClimber);
                sql.query("INSERT INTO climbers SET ?", NewClimber, (err, mysqlres)=>{
                    if (err) {
                        console.log("ERROR: ", err);
                        res.status(400).send({message: "error in creating an account " + err});
                        return;
                    }
                    console.log("New climber created");
                    return;
                } )
            }
    else
    {
        console.log(mysqlres);
        console.log("Sorry This email is already taken.");
    }
    })}; 

const Login = (req, res)=>{
    if (!req.body) {
        res.status(400).send({message: "content cannot be empty"});
        return;
    }
    const LoginInfo = {
        
        "email": req.body.LoginUserEmail,
        "Password": req.body.LoginPassword
        
    };
    console.log(LoginInfo.Password);
    console.log(LoginInfo.email);
    sql.query("SELECT * FROM climbers where email=? and password=?",[LoginInfo.email,LoginInfo.Password], (err, mysqlres)=>{
 
        if (err) throw err;
        if (mysqlres.length > 0) 
        {
            console.log(mysqlres);
            res.send(mysqlres);
            // Redirect to home page
            console.log("Youre logged in")
        }
       
        else 
        {
            res.send('Incorrect Username and/or Password!');
        }			
 
    })}; 

        const createNewRecords = (req, res)=>{
            const NewRecord = {
                "email": "Check@Check.com",
                "date": (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' '),
                "duration":req.body.TimeStamp,
                "level":convertLevel(req.body.ChosenLevel)
            };
            console.log(NewRecord);
           
                sql.query("INSERT INTO stats SET ?", NewRecord, (err, mysqlres)=>{
                    if (err) {
                        console.log("ERROR: ", err);
                        res.status(400).send({message: "error in creating the record " + err});
                        return;
                    }
                    console.log("New Record created");
                    
                    return;
                } )
                
        }; 
         function convertLevel(num)
         {
            
          if(num==1) return "easy";
          if(num==2) return "medium";
          if(num==3) return "hard";
              
         }
         const PullStats = (req, res)=>{

         sql.query("SELECT * FROM stats", (err, data)=>{
            if (err) {
                console.log("ERROR: ", err);
                res.status(400).send({message: "error in creating the record " + err});
                return;
            }
            return;
         } )
        };

module.exports = {createNewClimber,Login,createNewRecords,PullStats};