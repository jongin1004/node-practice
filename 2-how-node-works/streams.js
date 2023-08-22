const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
    // Solution 1  
    // fs.readFile('test-file.txt', (err, data) => {
    //     if (err) console.log(err);

    //     res.end(data);
    // });

    // Solution 2 : Streams
    // const readable = fs.createReadStream('test-file.txt');
    // readable.on('data', (chunk) => {
    //     res.write(chunk)
    // })

    // readable.on('end', () => {

    //     res.end('end');
    // })

    // readable.on('error', (err) => {

    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('File not found');
    // })

    // Solution 3 
    // Solution 2에서는 파일에서 읽어오는 데이터 속도와 브라우저로 응답하는 속도가 맞지 않아 백프레셔가 발생
    // 데이터가 소비자 쪽으로 흘러가는 속도와 생산자 쪽에서 생성되는 속도 간에 불균형이 발생할 때 백프레셔 문제가 발생할 수 있습니다.
    // 간단히 말해서, 백프레셔란 소비자가 데이터를 받아들일 수 있는 속도를 넘어서는 속도로 데이터가 생성되는 상황을 의미합니다. 이런 상황에서 데이터가 쌓이게 되면 메모리 부족과 같은 문제가 발생할 수 있습니다.
    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res);
    // 

    // readable.on('end', () => {

    //     res.end('end');
    // })

    // readable.on('error', (err) => {

    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('File not found');
    // })
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening...');
});