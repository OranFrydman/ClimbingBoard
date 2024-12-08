// module.exports = {
//     HOST: "localhost",
//     USER: "root",
//     PASSWORD: "oMate5357#",
//     DB: "mysql"

//     };

module.exports = {
  DB_HOST: process.env.HOST || "localhost",
  DB_USER: process.env.USER || "root",
  DB_PASSWORD: process.env.PASSWORD || "oMate5357#",
  DB: process.env.DB || "mysql",
};
