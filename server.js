// console.log(process.env);
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
require('./dev-data/data/import-dev-data');
const port = process.env.PORT || 3001;
// console.log(process.env);
app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
