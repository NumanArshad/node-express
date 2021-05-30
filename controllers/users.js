const db = require("../db/index");

const getAllUsers = (req, res) => {
  db.query("select * from users", (error, response) => {
    console.log("response is", response.rows);
    res.status(200).json({
      result: response.rows,
    });
  });
};

const getUserById = (req, res) => {
  console.log(req.params);
  db.query(
    "select * from users where id = $1",
    [req.params.id],
    (error, response) => {
      console.log("response is", response);
      res.status(200).json({
        result: response.rows,
      });
    }
  );
};

const isUserExist = async (email) => {
  try {
    const response = await db.query("select * from users where email = $1", [
      email,
    ]);

    if (response.rowCount) {
      return response.rows[0];
    }
    return null;
  } catch (error) {
    return null;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  isUserExist,
};
