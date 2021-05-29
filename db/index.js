const pg = require("pg");

const pool = new pg.Pool(
  //   {
  //   user: process.env.USER,
  //   host: process.env.HOST,
  //   database: process.env.DATABASE,
  //   password: process.env.PASSWORD,
  //   port: process.env.DB_PORT,
  // }
  { connectionString: process.env.DATABASE_URL }
);

console.log(process.env.USER);

pool.connect((error, client) => {
  if (error) {
    console.log("db connection failure", error.message);
    // throw error;
    process.exit();
    return;
  }
  console.log("database connection established successfully!");
});

module.exports = pool;
