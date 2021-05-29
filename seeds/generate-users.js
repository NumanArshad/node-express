const fs = require("fs");
const faker = require("faker");
//const argv = require('yargs').argv

//const lines = argv.lines || 1000000
//const filename = argv.output || '<!-- REPLACE YOUR SQL FILE NAME -->'
const filename = "20210529145334-users-faker-seeding-up.sql";
const writeStream = fs.createWriteStream("./migrations/sqls/" + filename);

const createUser = () => {
  const { userName, email, password } = faker.internet;

  return `('${userName()}','${email()}',${password(10).toString()});\n`;
};

const startWriting = (writeStream, encoding, done) => {
  let i = 3;
  function writing() {
    let canWrite = true;
    do {
      i--;
      let post =
        "INSERT INTO users (username, email, password) VALUES " + createUser();
      //check if i === 0 so we would write and call `done`
      if (i === 0) {
        // we are done so fire callback
        writeStream.write(post, encoding, done);
      } else {
        // we are not done so don't fire callback
        writeStream.write(post, encoding);
      }
      //else call write and continue looping
    } while (i > 0 && canWrite);
    if (i > 0 && !canWrite) {
      //our buffer for stream filled and need to wait for drain
      // Write some more once it drains.
      writeStream.once("drain", writing);
    }
  }
  writing();
};

//write our `header` line before we invoke the loop
//writeStream.write(`\n`, 'utf-8')
//invoke startWriting and pass callback
startWriting(writeStream, "utf-8", () => {
  writeStream.end();
});
