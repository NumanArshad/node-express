const fs = require("fs");
const faker = require("faker");
const argv = require("yargs").argv;

const lines = argv.lines || 10;
//const filename = argv.output || '<!-- REPLACE YOUR SQL FILE NAME -->'
const filename = "20210529145334-users-faker-seeding-up.sql";

if (!filename) throw new Error("filename is missing");
// const writeStream = fs.createWriteStream("./migrations/sqls/" + filename);

const createUser = () => {
  const { userName, email, password } = faker.internet;

  return `INSERT into users (username, email, password) VALUES ('${userName()}','${email()}','${password(
    10
  )}');\n`;
};

(() => {
  let iteratingArray = [...Array(lines)];
  let fileContent = "";

  iteratingArray.forEach((data) => {
    fileContent += createUser();
  });

  fs.appendFile(
    "./migrations/sqls/" + filename,
    fileContent,
    (err, response) => {
      if (err) throw err;
      console.log("file append success");
      return;
    }
  );
})();

// const startWriting = (writeStream, encoding, done) => {
//   let i = 3;
//   function writing() {
//     let canWrite = true;
//     do {
//       i--;
//       let post =
//         "INSERT INTO users (username, email, password) VALUES " + createUser();
//       //check if i === 0 so we would write and call `done`
//       if (i === 0) {
//         // we are done so fire callback
//         writeStream.write(post, encoding, done);
//       } else {
//         // we are not done so don't fire callback
//         writeStream.write(post, encoding);
//       }
//       //else call write and continue looping
//     } while (i > 0 && canWrite);
//     if (i > 0 && !canWrite) {
//       //our buffer for stream filled and need to wait for drain
//       // Write some more once it drains.
//       writeStream.once("drain", writing);
//     }
//   }
//   writing();
// };

//write our `header` line before we invoke the loop
//writeStream.write(`\n`, 'utf-8')
//invoke startWriting and pass callback
// startWriting(writeStream, "utf-8", () => {
//   writeStream.end();
// });

////npm run migrate 'seeding data name'
//apply resultant sql file name in file name above
///change schema in createUser function

//how to run
//npm run seeding or npm run seeding --lines='any data count'
