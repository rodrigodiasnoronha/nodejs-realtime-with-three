const serialport = require('serialport');
const express = require('express');
const socket = require('socket.io');
const http = require('http');

// server
const app = express();
const server = http.createServer(app).listen(3000, () => {
    console.log('server running on port:', 3000);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// using websockets
const io = socket.listen(server);

// serial communication
const port = new serialport('COM7', { baudRate: 9600 });
const parser = port.pipe(new serialport.parsers.Readline());

parser.on('data', (data) => {
    if (data.includes('data')) {
        console.log(data);
        io.emit('gyr', data);
    }
});

parser.on('error', (err) => {
    console.log(err.message);
});
