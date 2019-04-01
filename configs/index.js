var express = require('express');

var app = express();
var server = app.listen(4000, () => { //Start the server, listening on port 4000.
    console.log("Listening to requests on port 4000...");
})

var io = require('socket.io')(server); //Bind socket.io to our express server.

app.use(express.static('public')); //Send index.html page on GET /

const SerialPort = require('serialport'); 
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('COM7'); //Connect serial port to port COM3. Because my Arduino Board is connected on port COM3. See yours on Arduino IDE -> Tools -> Port
const parser = port.pipe(new Readline({delimiter: '\n'})); //Read the line only when new line comes.
parser.on('data', (temp) => { //Read data
    console.log(temp);
    var datahora = new Date();
    var data = datahora.getDate()+"/"+(Number(datahora.getMonth())+1)+"/"+datahora.getFullYear();
    var hora = (datahora.getHours())+":"+(datahora.getMinutes());
    io.sockets.emit('temp', {date: data, time: hora, temp:temp}); //emit the datd i.e. {date, time, temp} to all the connected clients.
});

io.on('connection', (socket) => {
    console.log("Alguem acessou a página do gráfico >-<"); //show a log as a new client connects.
})