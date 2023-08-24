const express = require('express');
const fs = require('fs');

const app = express();

// 요청 데이터를 전달받기 위한 미들웨어
// app.use(): Express.js에서 미들웨어를 사용하기 위한 함수입니다. 미들웨어는 HTTP 요청 및 응답을 처리하는 과정에서 중간에 개입하여 다양한 작업을 수행할 수 있도록 해줍니다.
// express.json(): Express.js에서 제공하는 내장 미들웨어 중 하나로, JSON 데이터를 파싱하여 JavaScript 객체로 변환하는 역할을 수행합니다.
// 이 미들웨어는 POST 요청이나 PUT 요청과 같이 HTTP 요청 본문에 JSON 데이터가 포함되어 있을 때, 해당 JSON 데이터를 JavaScript 객체로 변환하여 req.body 객체에 저장합니다.
app.use(express.json());

// route도 하나의 미들웨어인데, 특정 경로를 지정하기 때문에 해당 경로에서만 동작하는 미들웨어
// 또한, 미들웨어는 선언하는 순서가 중요히다.
// 예를들어 route 미들웨어는 json을 반환하면서 응답과 요청의 사이클이 종료되기 때문에, 그 다음 미들웨어는 동작하지 않는다.
// 따라서, 아래에있는 미들웨어를 특정 라우트 뒤에 선언하게 되면, 해당 라우트가 실행되고 난 뒤에는 아래의 미들웨어는 동작하지 않게된다.
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  // next로 다음 미들웨어에 전다랗지 않으면, 응답과 요청이 중간에 멈추게된다.
  next();
});

// route의 요청이 언제 왔는지 체크하기 위해서, 현재의 시간을 req 속성으로 저장하는 미들웨어를 추가하면,
// route요청에서 req 속성에 접근해 활용할 수 있게된다.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  // req.params : 매개변수의 값들을 객체형태로 모두 저장
  const id = +req.params.id;
  const tour = tours.find((_tour) => _tour.id === id);

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'successfully updated data',
    },
  });
};

const deleteTour = (req, res) => {
  // 204 데이터가 존재하지 않는 경우(성공적으로 삭제하면 데이터가 없으니까)
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.get('/api/v1/tours', getAllTours);
// 매개변수 뒤 ?를 붙히면 옵셔널로 값이 없어도 routing된다. (:id? => params로 확인하는 경우에는 undefined)
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log('App running on port ${port}...');
});
