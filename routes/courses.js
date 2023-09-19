const routes = require("express").Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} = require("../controllers/courses");
const validateCreateUpdateCourse = require("../middleware/validations/courses");

routes.post("/", validateCreateUpdateCourse, createCourse);
routes.get("/", getAllCourses);
routes.get("/:id", getCourseById);
routes.put("/:id", validateCreateUpdateCourse, updateCourse);

module.exports = routes;
