const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config({ path: '.env.local' });
dotenvExpand(env);
