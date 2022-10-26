const PORT = 8080;

const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../dist/index.html'));
});
app.listen(PORT);

console.log(`running the server on port ${PORT}`);
