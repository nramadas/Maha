const path = require('path');

const colors = require('colors/safe');

const isEqual = require('lodash/isEqual');

const { readDir, readFile, writeFile } = require('./scriptHelpers');

const blueprint = process.argv[2];
const inputDir = process.argv[3];

if (!blueprint) {
  throw new Error('Must specify a blueprint file');
}

if (!inputDir) {
  throw new Error('Must specify directory where translations are stored');
}

Promise.all([
  readFile(blueprint),
  readDir(inputDir).then(files => {
    const translations = files
      .filter(file => file.endsWith('.translation.json'))
      .map(file => path.join(inputDir, file));

    if (translations.length === 0) {
      throw new Error('No files to sync');
    }

    return translations.map(file => ({
      fileName: file,
      contents: readFile(file),
    }));
  }),
])
  .then(([blueprintStr, filesData]) => {
    const blueprint = JSON.parse(blueprintStr);

    return Promise.all(
      filesData.map(fileData => {
        const fileName = fileData.fileName;

        return fileData.contents.then(fileStr => {
          const file = JSON.parse(fileStr);

          const removed = [];
          const added = [];
          const modified = [];

          // remove all the translations that are no longer applicable
          Object.keys(file.translations).forEach(hashKey => {
            if (!blueprint.translations[hashKey]) {
              delete file.translations[hashKey];
              removed.push(hashKey);
            }
          });

          // add the missing translations
          Object.keys(blueprint.translations).forEach(hashKey => {
            if (!file.translations[hashKey]) {
              file.translations[hashKey] = blueprint.translations[hashKey];
              added.push(hashKey);
            }
          });

          // check if variations were added
          Object.keys(blueprint.translations).forEach(hashKey => {
            const blueprintVariations =
              blueprint.translations[hashKey].variations;
            const fileVariations = file.translations[hashKey].variations;

            if (
              !isEqual(
                Object.keys(blueprintVariations),
                Object.keys(fileVariations),
              )
            ) {
              file.translations[hashKey] = blueprint.translations[hashKey];
              modified.push(hashKey);
            }
          });

          if (removed.length || added.length || modified.length) {
            console.log(colors.green('\nSyncing:'), colors.white(fileName));

            if (removed.length) {
              console.log('  - removed:');
              removed.forEach(r => console.log('     ', r));
            }

            if (added.length) {
              console.log('  + added:');
              added.forEach(r => console.log('     ', r));
            }

            if (modified.length) {
              console.log('  • modified:');
              modified.forEach(r => console.log('     ', r));
            }

            return writeFile(fileName, file);
          } else {
            console.log(
              colors.yellow('\nAlready update to date:'),
              colors.white(fileName),
            );
          }
        });
      }),
    );
  })
  .then(() => {
    console.log(colors.green('\nSYNC COMPLETE'));
  })
  .catch(e => {
    console.log(colors.red('\nSYNC FAILED:'));
    console.log(e);
  });
