const routes = require("express").Router();
const {
  assignCourseToTeacher,
  getAllTeachersCourses,
  courseAssignAlready,
  updateTeacherCourse,
} = require("../controllers/teacher_courses");
//const validateCreateUpdateCourse = require("../middleware/validations/courses");

routes.post("/", courseAssignAlready, assignCourseToTeacher);
routes.get("/", getAllTeachersCourses);
//routes.get("/:id", getCourseById);
routes.put("/:id", courseAssignAlready, updateTeacherCourse);

module.exports = routes;
