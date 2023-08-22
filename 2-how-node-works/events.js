const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('greet', () => {
    console.log('hi');
});

myEmitter.on('greet', () => {
    console.log('bye');
});

myEmitter.emit('greet');