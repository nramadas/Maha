const path = require('path');

const colors = require('colors/safe');

const { readFile, writeFile } = require('./scriptHelpers');

const name = process.argv[3];
const outputDir = process.argv[2];

if (!name) {
  throw new Error('Must specify the language name');
}

if (!outputDir) {
  throw new Error('Must specify output directory');
}

const EMPTY = {
  name,
  translations: {},
};

const filePath = path.join(outputDir, `${name}.translation.json`);

readFile(filePath)
  .then(r => {
    console.log(colors.red('\nLanguage already exists:'), colors.white(name));
  })
  .catch(e => {
    if (e.code === 'ENOENT') {
      return writeFile(filePath, EMPTY)
        .then(r => {
          console.log(
            colors.green('\nTranslation initialized:'),
            colors.white(name),
          );
        })
        .catch(e => {
          console.log(colors.red('\nCould not initialize translation:'));
          console.log(e);
        });
    } else {
      throw e;
    }
  });
