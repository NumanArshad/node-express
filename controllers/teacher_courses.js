const { UNPROCESSIBLE_ENTITY, NOT_FOUND } = require("../config/httpStatusCode");
const db = require("../db");
const { CustomPropertyError } = require("../middleware/errorHandler");
const paginationQuery = require("../utils/pagination");

const assignCourseToTeacher = async (req, res, next) => {
  try {
    const { course_id, teacher_id } = req.body;
    const response = await db.query(
      "insert into teacher_courses(course_id, teacher_id) values ($1, $2) returning *",
      [course_id, teacher_id]
    );
    if (response.rowCount) {
      return res.json({
        message: "teacher course created successfully",
        data: response.rows[0],
      });
    }
    next("teacher course created failure");
  } catch (error) {
    next(error);
  }
};

const getAllTeachersCourses = async (req, res, next) => {
  try {
    const columns = [
      { columnName: "username" },
      {
        columnName: "teacher_course_id",
        queryColumn: "teacher_courses.id",
        type: "other",
      },
      {
        columnName: "course_id",
        queryColumn: "courses.id",
        type: "other",
      },
      {
        columnName: "course_name",
        queryColumn: "courses.name",
      },
      {
        columnName: "teacher_id",
        queryColumn: "users.id",
        type: "other",
      },
    ];

    const data = (
      await db.query(`
    select teacher_courses.id as teacher_course_id, 
    courses.id as course_id,
    courses.name as course_name, 
    username,
    users.id as teacher_id from courses 
    join teacher_courses on courses.id = teacher_courses.course_id
    join users on users.id = teacher_courses.teacher_id ${paginationQuery(
      req.query,
      columns,
      "teacher_course_id"
    )}`)
    ).rows;
    res.send({ data });
  } catch (error) {
    next(error);
  }
};

// const getTeacherCourseById = async (req, res, next) => {
//   try {
//     const data = await db.query("select * from teacher_courses where id = $1", [
//       req.params.id,
//     ]);
//     res.send({ data });
//   } catch (error) {
//     next(error);
//   }
// };

const courseAssignAlready = async (req, res, next) => {
  console.log("already called");
  console.log(req.method);
  const { course_id, teacher_id } = req.body;

  const isPutMethod = req.method === "PUT";
  let params = [course_id, teacher_id];
  if (isPutMethod) params = [...params, req.params.id];
  try {
    const response = await db.query(
      `
   select * from teacher_courses
    where course_id = $1 and teacher_id = $2 ${
      isPutMethod ? `and id != $3` : ``
    }`,
      params
    );
    if (response.rowCount) {
      throw new CustomPropertyError(
        `course ${course_id} already assign to ${teacher_id}`,
        "course_id",
        UNPROCESSIBLE_ENTITY
      );
    }
    next();
  } catch (error) {
    console.log("error occuerd", error.message);
    next(error);
  }
};

const updateTeacherCourse = async (req, res, next) => {
  try {
    const response = await db.query(
      "update teacher_courses set course_id=$2 where id = $1 returning *",
      [req.params.id, req.body.course_id]
    );
    if (response.rowCount) {
      return res.send({ data: response.rows });
    }
    throw new CustomPropertyError(
      `teacher course not found against id ${req.params.id}`,
      "course_id",
      NOT_FOUND
    );
  } catch (error) {
    console.log("update error is", error.status);
    next(error);
  }
};

module.exports = {
  assignCourseToTeacher,
  getAllTeachersCourses,
  courseAssignAlready,
  updateTeacherCourse,
};
