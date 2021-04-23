const Tiger = require('fb-tiger-hash').Tiger;

const tiger = new Tiger(100);

module.exports = function calculateHash(text) {
  return tiger.hash(text);
};
