const pg = require("pg");
const envVariables = require("../config/envVariables");

const pool = new pg.Pool(
  //   {
  //   user: process.env.USER,
  //   host: process.env.HOST,
  //   database: process.env.DATABASE,
  //   password: process.env.PASSWORD,
  //   port: process.env.DB_PORT,
  // }
  { connectionString: envVariables.DATABASE_URL }
);

//console.log(process.env.DATABASE_URL);

pool.connect((error, client) => {
  if (error) {
    console.log("db connection failure", error.message);
    // throw error;
    process.exit();
  }
  console.log("database connection established successfully!");
});

module.exports = pool;
