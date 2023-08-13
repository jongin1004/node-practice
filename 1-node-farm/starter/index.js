// 내장된 모듈을 사용할 수 있다. 
const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');


// __dirname 현재 js 파일이 있는 디렉토리 위치
const filePath = `${__dirname}/txt/`;

// Blocking, synchronous way
// const textIn = fs.readFileSync(filePath + 'append.txt', 'utf-8');
// const textOut = `This is what we about the avocado: ${textIn}\nCreated at: ${Date.now()}`;
// fs.writeFileSync('./txt/write.txt', textOut);

// Non-blocking, asynchronous way
// fs.readFile(filePath + 'start.txt', 'utf-8', (err, data1) => {

//     return console.log(err);

//     fs.readFile(filePath + `${data1}.txt`, 'utf-8', (err, data2) => {

//         console.log(data2, err);
//         fs.readFile(filePath + 'append.txt', 'utf-8', (err, data3) => {

//             console.log(data3, err);
//             fs.writeFile(filePath + 'final.txt', `${data2}\n${data3}`,'utf-8', err => {

//                 console.log('파일 작성 완료');
//             })
//         });
//     });
// });


// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard     = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct  = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data    = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    // res.end('Hello from the server');
    
    
    // 두번째 파라미터에 true를 전달함으로써, 쿼리스트링을 파싱할 수 있도록 
    // 예: query: [Object: null prototype] { id: '0', q: '2asd' }
    const {query, pathname} = url.parse(req.url, true);        
    
    if (pathname === '/' || pathname === '/overview') {
        const cards  = dataObj.map(obj => replaceTemplate(tempCard, obj)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cards);

        res.writeHead(200, {'Content-type': 'text/html'});            
        res.end(output);    

    } else if (pathname === '/product') {
      
        const product = dataObj.find(obj => +obj.id === +query.id);        
        const output  = replaceTemplate(tempProduct, product);
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(output);

    } else if (pathname === '/api') {
        
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    } else {

        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>not found page</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});

