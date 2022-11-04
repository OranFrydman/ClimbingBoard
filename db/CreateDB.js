var SQL = require('./db');
const path = require('path');
const csv=require('csvtojson');
const e = require('express');


const CreateTable_Users = (req,res)=> {
    var Q1 = "CREATE TABLE climbers (email VARCHAR(255) NOT NULL PRIMARY KEY, name VARCHAR(255) NOT NULL ,password VARCHAR(255) NOT NULL)";
    SQL.query(Q1,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.render('CrushView',{GetMsg: "There was a problem creating the table"+err});
            return;
        }
        console.log('Users table created');
        res.render('CrushView',{GetMsg: "Users Table created successfully"});
    })    
}


const InsertData_Users = (req,res)=>{
    var Q2 = "INSERT INTO climbers SET ?";
    const csvFilePath= path.join(__dirname, "Data_Users.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "email": element.email,
            "name": element.name,
            "password": element.password   
        };
        SQL.query(Q2, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
                res.render('CrushView',{GetMsg: "There was a problem adding a new user "+err});
                return;
            }
            console.log("created row sucssefuly ");
        });
       
    });
    })
    
    res.render('CrushView',{GetMsg: "The data was inserted successfully"});
};
 

const ShowTable_Users = (req,res)=>{
    var Q3 = "SELECT * FROM climbers";
    SQL.query(Q3, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing table ", err);
            res.send("error in showing table ");
            return;
        }
        console.log("showing table");
        res.send(mySQLres);
        return;
    })};

const DropTable_Users = (req, res)=>{
    var Q4 = "DROP TABLE climbers";
    SQL.query(Q4, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping table ", err);
            res.render('CrushView',{GetMsg: "There was a problem dropping Users table"+err});
            return;
        }
        console.log("table drpped");
        res.render('CrushView',{GetMsg: "Users table dropped successfully"});
        return;
    })
}
const CreateTable_Stats = (req,res)=>{
    var Q5 = "CREATE TABLE stats (email VARCHAR(255) NOT NULL ,date DATETIME NOT NULL PRIMARY KEY ,duration TIME NOT NULL, level VARCHAR(255) NOT NULL)";
    SQL.query(Q5,(err,mySQLres)=>{
        if (err) {
            console.log("error ", err);
            res.render('CrushView',{GetMsg: "There was a problem creating the table "+err});
            return;
        }
        console.log('stats table created');
        res.render('CrushView',{GetMsg: "Stats Table created successfully"});
        return;
    }) 
}
const InsertData_Stats = (req,res)=>{
    var Q6 = "INSERT INTO stats SET ?";
    const csvFilePath= path.join(__dirname, "Data_Stats.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "email": element.email,
            "date": element.date,
            "duration": element.time,
            "level": element.level

        };
        SQL.query(Q6, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
                res.render('CrushView',{GetMsg: "There was a problem adding a new climb record "+err});
                return;
            }
            console.log("created row sucssefuly ");
        });
    });
    })
    
    res.render('CrushView',{GetMsg: "The Data was inserted successfully"});
};

const DropTable_Stats = (req, res)=>{
    var Q7 = "DROP TABLE stats";
    SQL.query(Q7, (err, mySQLres)=>{
        if (err) {
            console.log("error in droping table ", err);
            res.render('CrushView',{GetMsg: "There was a problem dropping Users table"+err});
            return;
        }
        console.log("table drpped");
        res.render('CrushView',{GetMsg: "Table Stats dropped successfully"});
        return;
    })
}

const ShowTable_Stats = (req,res)=>{
    var Q3 = "SELECT * FROM stats";
    SQL.query(Q3, (err, mySQLres)=>{
        if (err) {
            console.log("error in showing table ", err);
            res.send("error in showing table ");
            return;
        }
        console.log("showing table");
        res.send(mySQLres);
        return;
    })};


module.exports = {CreateTable_Users,CreateTable_Stats, InsertData_Users, InsertData_Stats, ShowTable_Users,ShowTable_Stats, DropTable_Users, DropTable_Stats}