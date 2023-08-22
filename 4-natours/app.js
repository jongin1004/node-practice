const express = require('express');

const app = express();

app.get('/', (req, res) => {
  console.log(req);
  res.status(200).json({
    msg: 'Hello from the server side!',
    method: 'get',
  });
});

app.post('/', (req, res) => {
  res.status(200).json({
    msg: 'Hello from the server side!',
    method: 'post',
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('App running on port ${port}...');
});
