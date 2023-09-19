const db = require("../db");

const createCourse = async (req, res, next) => {
  try {
    const { name } = req.body;
    const response = await db.query(
      "insert into courses(name) values ($1) returning *",
      [name]
    );
    if (response.rowCount) {
      res.json({
        message: "course created successfully",
        data: response.rows[0],
      });
    }
    res.status(422).json({ message: "course created failure" });
  } catch (error) {
    next(error.message);
  }
};

const getAllCourses = async (req, res, next) => {
  try {
    const data = (await db.query("select * from courses")).rows;
    res.send({ data });
  } catch (error) {
    next(error.message);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const data = (
      await db.query("select * from courses where id = $1", [req.params.id])
    ).rows;
    res.send({ data });
  } catch (error) {
    next(error.message);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const response = await db.query(
      "update courses set name=$2 where id = $1 returning *",
      [req.params.id, req.body.name]
    );
    if (response.rowCount) {
      return res.send({ data: response.rows });
    }
    res
      .status(400)
      .send({ message: `course not found against id ${req.params.id}` });
  } catch (error) {
    console.log("update error is", error.status);
    next(error.message);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
};
