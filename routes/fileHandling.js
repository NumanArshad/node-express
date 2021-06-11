const route = require("express").Router();

const fileHandling = require("../controllers/fileHandling");

route.get("/file-upload", fileHandling.getUploadFile);
route.post("/file-upload", fileHandling.postUploadFile);
route.post("/file-upload-multiple", fileHandling.postMultipleFile);

module.exports = route;
