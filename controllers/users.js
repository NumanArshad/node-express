const db = require("../db/index");
const paginationQuery = require("../utils/pagination");

const getAllUsers = (req, res, next) => {
  const colums = ["id", "email", "username"];
  db.query(
    `select * from users ${paginationQuery(req.query, colums)}`,
    (error, response) => {
      if (error) {
        console.log("error is", error.message);
        next(error.message);
        return;
      }
      res.status(200).json({
        result: response.rows,
      });
    }
  );
};

const getUserById = (req, res) => {
  console.log(req.params);
  db.query(
    "select * from users where id = $1",
    [req.params.id],
    (error, response) => {
      console.log("response is", response);
      if (!response.rowCount) {
        res.status(404).json({
          result: "user not found",
        });
        return;
      }
      res.status(200).json({
        result: response.rows,
      });
    }
  );
};

const isUserExist = async ({ email, id }) => {
  let columnName = email ? "email" : "id";
  try {
    const response = await db.query(
      `select * from users where ${columnName} = $1`,
      [email ?? id]
    );
    //  console.log(email, id, columnName, { response });

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
