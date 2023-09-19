const multer = require("multer");
const { newDirectory } = require("../utils/rootpath_resolvedir");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    newDirectory("images", (callBack) => cb(null, "images"));
  },
  filename: (req, file, cb) => {
    let fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

const multerStorage = multer({ storage });
const getUploadFile = (req, res) => {
  res.render("FileUpload.ejs");
};

const postUploadFile = (req, res) => {
  // console.log(req.file);
  multerStorage.single("myFile")(req, res, (err) => {
    console.log(req.file);
    if (err) {
      console.log("error in upload is", req.file, err);
      res.send("can not upload");
      return;
    }
    res.send("nice file upload");
  });
};

const postMultipleFile = (req, res) => {
  //console.log({ name: req.files });
  multerStorage.array("myFiles", 5)(req, res, (err) => {
    console.log(req.files);
    if (err) {
      console.log("error in upload multiple is", req.files, err);
      res.send("can not upload multiple");
      return;
    }
    res.send("nice file upload multiple");
  });
};

module.exports = {
  getUploadFile,
  postUploadFile,
  postMultipleFile,
};
