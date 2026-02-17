// For local dev: use the SAME DB as Render by setting in env.txt:
//   HOST=<remote DB host from Render env>
//   USER or DB_USER=<DB user>
//   PASSWORD=<DB password>
//   DB=<database name>
// If HOST is unset, it defaults to "localhost" (your Mac's MySQL), which fails
// when that user only exists on the remote server.

module.exports = {
  DB_HOST: process.env.DB_HOST || process.env.HOST || "localhost",
  DB_USER: process.env.DB_USER || process.env.USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || process.env.PASSWORD || "",
  DB: process.env.DB || "mysql",
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
};
