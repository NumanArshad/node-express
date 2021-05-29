const db = require("../db/index");

exports.getAllUsers = (req, res) => {
  db.query("select * from users", (error, response) => {
    console.log("response is", response);
    res.status(200).json({
      result: "good",
    });
  });
};
