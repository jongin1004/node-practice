const express = require('express');
const fs = require('fs');

const app = express();

// 요청 데이터를 전달받기 위한 미들웨어
// app.use(): Express.js에서 미들웨어를 사용하기 위한 함수입니다. 미들웨어는 HTTP 요청 및 응답을 처리하는 과정에서 중간에 개입하여 다양한 작업을 수행할 수 있도록 해줍니다.
// express.json(): Express.js에서 제공하는 내장 미들웨어 중 하나로, JSON 데이터를 파싱하여 JavaScript 객체로 변환하는 역할을 수행합니다.
// 이 미들웨어는 POST 요청이나 PUT 요청과 같이 HTTP 요청 본문에 JSON 데이터가 포함되어 있을 때, 해당 JSON 데이터를 JavaScript 객체로 변환하여 req.body 객체에 저장합니다.
app.use(express.json());

// app.get('/', (req, res) => {
//   console.log(req);
//   res.status(200).json({
//     msg: 'Hello from the server side!',
//     method: 'get',
//   });
// });

// app.post('/', (req, res) => {
//   res.status(200).json({
//     msg: 'Hello from the server side!',
//     method: 'post',
//   });
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// 매개변수 뒤 ?를 붙히면 옵셔널로 값이 없어도 routing된다. (:id? => params로 확인하는 경우에는 undefined)
app.get('/api/v1/tours/:id', (req, res) => {
  // req.params : 매개변수의 값들을 객체형태로 모두 저장
  const id = +req.params.id;
  const tour = tours.find((_tour) => _tour.id === id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);

  const newId = tours.slice(-1).id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'successfully updated data',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'successfully deleted data',
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('App running on port ${port}...');
});
