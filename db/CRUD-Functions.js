const sql = require('./db');
var path = require('path');




    const createNewClimber = (req, res)=>{
    if (!req.body) {
        res.render('CrushView',{GetMsg: "content cannot be empty"});
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
                        res.render('CrushView',{GetMsg: "Error Creating the account"+err});
                        return;
                    }
                    console.log("New climber created");
                    res.render('CrushView',{GetMsg: "Welcome! We are so happy you decided to join us =] go back home, sign in and begin your workout progress"});
                    return;
                } )
            }
    else
    {
        res.render('CrushView',{GetMsg: "Sorry, this email is already taken. We have yet to develop the feature to reset password please register with a new email"});
    }
    })}; 

    const Login = (req, res)=>{
    if (!req.body) {
        res.render('CrushView',{GetMsg: "content cannot be empty"});
        return;
    }
    const LoginInfo = {
        
        "email": req.body.LoginUserEmail,
        "Password": req.body.LoginPassword
        
    };
    console.log(LoginInfo.Password);
    console.log(LoginInfo.email);
    sql.query("SELECT * FROM climbers where email=? and password=?",[LoginInfo.email,LoginInfo.Password], (err, mysqlres)=>{
 
        if (err) res.render('CrushView',{GetMsg: "Login Error"+err});;
        if (mysqlres.length > 0) 
        {
            console.log(mysqlres);
            
            // Redirect to home page
            console.log("Youre logged in");
            res.append('Set-Cookie', 'UserMail_C='+LoginInfo.email+'; Path=/; HttpOnly');
            res.append('Set-Cookie', 'UserName_C='+mysqlres[0].name+'; Path=/; HttpOnly');
            res.redirect('/HomePage');
        }
       
        else 
        {
            res.render('CrushView',{GetMsg: "Something went wrong, You used a wrong email or password. Go back home and try again"});
        }			
 
    })}; 
    const LogOut = (req,res)=>{
        res.append('Set-Cookie', 'UserMail_C=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
        res.append('Set-Cookie', 'UserName_C=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
        res.render('HomePage',{user: "Welcome, "+GetUser(req,res,"name")});
        console.log("You're logged out")
    }
    const createNewRecords = (req, res)=>{
            const NewRecord = {
                "email": GetUser(req,res,"email"),
                "date": (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' '),
                "duration":req.body.TimeStamp,
                "level":convertLevel(req.body.ChosenLevel)
            };
            console.log(NewRecord);
            // sql.connect();
                sql.query("INSERT INTO stats SET ?", NewRecord, (err, mysqlres)=>{
                    if (err) {
                        console.log("ERROR: ", err);
                        res.render('CrushView',{GetMsg: "Error Creating new Climb record"+err});
                        return;
                    }
                    console.log("New Record created");
                    PullStats(req,res);
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
         let EmailQuery = GetUser(req,res,"email")
         console.log("Pulling stats with "+EmailQuery);
         sql.query("SELECT ROW_NUMBER() OVER(ORDER BY (Select 0)) as num ,DATE_FORMAT(date,'%Y/%m/%d - %H:%i:%S') as date,duration,level FROM stats WHERE email=?",EmailQuery, (err, data)=>{
            if (err) {
                res.render('CrushView',{GetMsg: "Error couldnt pull your climbs "+err});
                
                return;
            }
   
            console.log("pulling stats...");
            res.render('Statistics',{
                myclimbs:data,
                user: "Welcome, "+GetUser(req,res,"name")
            });
            return;
         });
         
        };
    const PullFilters = (req, res)=>{
            const QueryFilter = {
                "DateStart": req.body.DateStart,
                "DateFinish": req.body.DateFinish,
                "EasyFilter": req.body.EasyFilter,
                "MediumFilter": req.body.MediumFilter,
                "HardFilter": req.body.HardFilter
            };
            if( !QueryFilter.EasyFilter&&!QueryFilter.MediumFilter&&!QueryFilter.HardFilter)
            {
                QueryFilter.EasyFilter="easy"
                QueryFilter.MediumFilter="medium"
                QueryFilter.HardFilter="hard"
            }
            if( !QueryFilter.DateStart)
            {
                QueryFilter.DateStart="1995-05-14"
            }
            if( !QueryFilter.DateFinish)
            {
                QueryFilter.DateFinish="2099-05-14"
            }
            let EmailQuery = GetUser(req,res,"email")
            sql.query("SELECT ROW_NUMBER() OVER(ORDER BY (Select 0)) as num , DATE_FORMAT(date,'%Y/%m/%d - %H:%i:%S') as date,duration,level FROM stats WHERE email=? and level IN (?,?,?) and date between ? and ?",
               [EmailQuery,
                QueryFilter.EasyFilter,
                QueryFilter.MediumFilter,
                QueryFilter.HardFilter,
                QueryFilter.DateStart,
                QueryFilter.DateFinish]
                 ,(err, data)=>{
               if (err) {
                   console.log("ERROR: ", err);
                   res.render('CrushView',{GetMsg: "Error couldnt pull your climbs "+err});
                   return;
               }
               console.log("pulling filter stats..success")
               res.render('statistics',{
                   myclimbs:data,
                   user: "Welcome, "+GetUser(req,res,"name")
               })
               return;
            });
            
           };

    const DeleteUser = (req, res)=>{
            let EmailQuery = GetUser(req,res,"email")
            if(EmailQuery == "Guest@Guest.Guest")
            {
                res.render('CrushView',{GetMsg: "You're Not logged in "});
                return;
            }
            
            sql.query("DELETE FROM stats WHERE email=?",EmailQuery, (err, data)=>{
               if (err) {  
                res.render('CrushView',{GetMsg: "We couldnt delete this account's climb "+err});
               }
               res.render('CrushView',{GetMsg: "All Climbs deleted successfully"});
            });
           };


    function GetUser(req,res,field){
            if (req.get("Cookie"))
            {
               var session = req.get("Cookie");
               console.log("Session is +"+session)
               var splitSession = session.split(/=|;/);
               var email = splitSession[3];
               var username = splitSession[5];
               if(field =="email") return email;
               if(field=="name") return username; 
            }
            if(field =="email") return "Guest@Guest.Guest";
            if(field=="name") return "Guest";
           };
module.exports = {createNewClimber,Login,LogOut,createNewRecords,PullStats,PullFilters,DeleteUser};