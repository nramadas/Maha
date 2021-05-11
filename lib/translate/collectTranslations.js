const path = require('path');

const babel = require('@babel/core');
const colors = require('colors/safe');
const glob = require('glob');
const shell = require('shelljs');

const hash = require('./hash');
const { readFile, writeFile } = require('./scriptHelpers');

const outputDir = process.argv[2];

if (!outputDir) {
  throw new Error('Must specify output directory');
}

const BLUEPRINT = {
  name: '',
  translations: {},
};

const PREDICATE = 'i18n';
const FUNCTIONS = ['Translate', 'translate', 'Param'];
const RELEVANT_SYNTAX = FUNCTIONS.map(fn => `${PREDICATE}.${fn}`);

function isJSXTranslate(node) {
  return (
    node.openingElement.name.type === 'JSXMemberExpression' &&
    node.openingElement.name.object.name === PREDICATE &&
    node.openingElement.name.property.name === 'Translate'
  );
}

function isJSXParam(node) {
  return (
    node.openingElement.name.type === 'JSXMemberExpression' &&
    node.openingElement.name.object.name === PREDICATE &&
    node.openingElement.name.property.name === 'Param'
  );
}

function isStringTemplateTranslate(node) {
  return (
    node.tag &&
    node.tag.object &&
    node.tag.property &&
    node.tag.object.name === PREDICATE &&
    node.tag.property.name === 'translate'
  );
}

function addToBlueprint(template, variations) {
  BLUEPRINT.translations[hash(template)] = {
    reference: template,
    template: '',
    variations: variations.reduce((acc, variation) => {
      acc[variation] = '';
      return acc;
    }, {}),
  };
}

function generateVariations(substitutions) {
  let variations = [];

  substitutions.forEach(substitution => {
    let subVariations = ['%%' + substitution.name];

    if (substitution.gender) {
      subVariations = subVariations.flatMap(variation => [
        variation + '.M',
        variation + '.F',
        variation + '.N',
      ]);
    }

    if (substitution.count) {
      subVariations = subVariations.flatMap(variation => [
        variation + '.none',
        variation + '.one',
        variation + '.many',
      ]);
    }

    if (subVariations.length > 1) {
      if (variations.length) {
        variations = variations.flatMap(variation => {
          return subVariations.map(subVar => variation + '--' + subVar);
        });
      } else {
        variations = subVariations;
      }
    }
  });

  return variations;
}

function collector({ types: t }) {
  return {
    name: 'collector',
    visitor: {
      JSXElement(path) {
        const { node } = path;
        if (isJSXTranslate(node)) {
          const substitutions = [];

          const phrases = node.children
            .map((child, index) => {
              switch (child.type) {
                case 'JSXText': {
                  const text = child.value
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ');

                  if (index === 0) {
                    return text.trimStart();
                  }

                  if (index === node.children.length - 1) {
                    return text.trimEnd();
                  }

                  return text;
                }
                case 'JSXExpressionContainer': {
                  return child.value;
                }
                case 'JSXElement': {
                  if (isJSXParam(child)) {
                    let name;
                    let count;
                    let gender;

                    child.openingElement.attributes.forEach(attr => {
                      if (attr.name.name === 'name') {
                        name = attr.value.value;
                      }

                      if (attr.name.name === 'count') {
                        count = true;
                      }

                      if (attr.name.name === 'gender') {
                        gender = true;
                      }
                    });

                    if (name) {
                      substitutions.push({
                        name,
                        count,
                        gender,
                      });
                      return '%%' + name;
                    }
                  }
                }
              }
            })
            .filter(Boolean);

          const template = phrases.join('');
          const variations = generateVariations(substitutions);

          addToBlueprint(template, variations);
        }
      },
      TaggedTemplateExpression(path) {
        const { node } = path;
        if (isStringTemplateTranslate(node)) {
          const strings = node.quasi.quasis;
          const expressions = node.quasi.expressions;
          const parts = [];
          const substitutions = [];

          strings.forEach((string, index) => {
            parts.push(string.value.raw);

            if (!string.tail) {
              const expression = expressions[index];

              const substitution = {};
              expression.properties.forEach(p => {
                substitution[p.key.name] = p.value.value;
              });

              if (substitution.name) {
                parts.push('%%' + substitution.name);
                substitutions.push(substitution);
              }
            }
          });

          const template = parts.join('');
          const variations = generateVariations(substitutions);

          addToBlueprint(template, variations);
        }
      },
    },
  };
}

const plugin = babel.createConfigItem(collector, {
  type: 'plugin',
});

const FILE_EXT = '.@(ts|tsx)';

const fileContainsTranslations = new RegExp(
  `\\b(?:${RELEVANT_SYNTAX.join('|')})\\b`,
);

const folders = [
  './components',
  './contexts',
  './emails',
  './graphql',
  './hooks',
  './lib',
  './models',
  './native',
  './pages',
];

const getFiles = src => glob.sync(src + '/**/*' + FILE_EXT, { nodir: true });

const srcFiles = shell
  .grep('-l', fileContainsTranslations, [].concat(...folders.map(getFiles)))
  .trim()
  .split('\n')
  .filter(filepath => filepath.trim());

console.log(colors.green('\nPulling translations for the following files:'));
srcFiles.forEach(file => console.log('  > ' + file));

Promise.all(srcFiles)
  .then(files => {
    return Promise.all(
      files.map(file => {
        return readFile(file).then(contents => {
          return babel.transformAsync(contents, {
            filename: file,
            plugins: [plugin],
          });
        });
      }),
    );
  })
  .then(() => {
    console.log(colors.green('\nTranslations extracted'));
    console.log(colors.cyan('The following translations were generated:'));
    Object.entries(BLUEPRINT.translations).forEach(([name, value]) => {
      if (name !== 'name') {
        console.log(`  | ${name}: ${value.reference}`);
      }
    });

    const outputFile = path.join(outputDir, '/translationBlueprint.json');
    console.log(colors.green('\nWriting result to:'), colors.white(outputFile));
    return writeFile(outputFile, BLUEPRINT);
  })
  .catch(e => {
    console.log(colors.red('\nSomething went wrong'));
    console.log(e);
  });
