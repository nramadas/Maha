const fs = require('fs');

const readFile = file =>
  new Promise((res, rej) => {
    fs.readFile(file, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result.toString());
      }
    });
  });

const readDir = dir =>
  new Promise((res, rej) =>
    fs.readdir(dir, {}, (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    }),
  );

const writeFile = (path, data) =>
  new Promise((res, rej) => {
    fs.writeFile(path, JSON.stringify(data, null, 4), (err, result) => {
      if (err) {
        rej(err);
      } else {
        res(result);
      }
    });
  });

module.exports = {
  readFile,
  readDir,
  writeFile,
};
