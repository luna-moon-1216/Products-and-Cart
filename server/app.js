const app = require('./index.js');

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log(`Moving and groving on port ${port}`);
});