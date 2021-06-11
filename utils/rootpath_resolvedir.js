const path = require("path");
const fs = require("fs");
const rootPath = path.dirname(process.mainModule.filename);

const newDirectory = (directoryName, callBack) => {
  fs.access(directoryName, (err) => {
    if (err) {
      console.log({ err });
      fs.mkdirSync(directoryName, { recursive: true });
      callBack();
      return;
    }
    callBack();
    return;
  });
};

module.exports = {
  newDirectory,
  rootPath,
};
