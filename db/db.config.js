// module.exports = {
//     HOST: "localhost",
//     USER: "root",
//     PASSWORD: "oMate5357#",
//     DB: "mysql"
    
//     };

module.exports = {
        HOST: process.env.HOST || "localhost",
        USER: process.env.USER || "root",
        PASSWORD: process.env.PASSWORD || "oMate5357#",
        DB: process.env.DB || "mysql"
        
        };