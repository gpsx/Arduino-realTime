var express = require('express'); //Recupera o modulo Serial express

var app = express();

var path = require('path'); //Recupera o modulo path, que vem junto do express

var sql = require('mssql');

var server = app.listen(4000, () => { //Inicia o servidor na porta 4000
})

var io = require('socket.io')(server); //Recupera o modulo so socket.io e atrela o socket.io ao nosso servidor express.

var sensor;
app.use(express.static('public')); //Send index.html page on GET /

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const config = {
	user: 'messias01191024',
	password: '#Gf49795868802',
	server: 'servidor01191024.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
	database: 'BancoProjeto',
 
	options: {
		encrypt: true // Use this if you're on Windows Azure
	}
}


const SerialPort = require('serialport'); //Recupera o modulo Serial Port

// SerialPort.list().then(entradas_seriais => {

//     // este bloco trata a verificação de Arduino conectado (inicio)

//     var entradas_seriais_arduino = entradas_seriais.filter(entrada_serial => {
//         return entrada_serial.vendorId == 2341 && entrada_serial.productId == 43;
//     });

//     if (entradas_seriais_arduino.length != 1) {
//         throw new Error("Nenhum Arduino está conectado ou porta USB sem comunicação ou mais de um Arduino conectado");
//     }

//     return entradas_seriais_arduino[0].comName;


//     // este bloco trata a verificação de Arduino conectado (fim)

// }).then(ArduinoCon => {
//     receiveSend(ArduinoCon);
// })

function receiveSend(porta) {
    const Readline = SerialPort.parsers.Readline; // Atribui o metodo readline do serial port a variável ReadLine
    const port = new SerialPort(`COM7`); //Conecta a porta serial COM5. Veja a sua na IDE do Arduino -> Tools -> Port

    const parser = port.pipe(new Readline({delimiter: '\r\n'})); //Lê a linha apenas se uma nova linhas for inserida
    parser.on('data', (data) => { //Na recepção dos dados = "On data retrieving"
    console.log(data);//Printa o dado recebido no console
    ut = data.split(',');
    temp = ut[0];

    console.log('Temperatura:',ut[0],'Umidade:',ut[1])
    var datahora = new Date();//Pega a data do sistema 

    var data = datahora.getDate()+"/"+(Number(datahora.getMonth())+1)+"/"+datahora.getFullYear(); //Transforma em uma data legível 1/4/2019

    var hora = (datahora.getHours())+":"+(datahora.getMinutes()); //Transforma em uma hora legível 15:00

    io.sockets.emit('temp', {date: data, time: hora, temp:data}); //Emite o objeto temp, com os atributos date, time e temp

    sql.connect(config, err => {
        // ... error checks
     
        const request = new sql.Request()
        request.stream = true // You can set streaming differently for each request
        request.query(`INSERT INTO Alerta(Temperatura, Umidade, Sensor_Id) VALUES ('${temp}', '${data[1]}', ${sensor.Id})`) // or request.execute(procedure)
     
        request.on('error', err => {
            console.log(err)
        })
        request.on('done', result => {
            console.log('Dados registrados com sucesso');
            sql.close();
        })
        
    })
});
}



rl.question('Qual o código do seu sensor?', (answer) => {
    // TODO: Log the answer in a database
    sql.connect(config).then(() => {
        return sql.query`Select * from Sensor where Codigo = ${answer}`
    }).then(result => {        
        if (result.rowsAffected > 0) {
            sensor = result.recordset[0];
            console.log("Achou");
            console.log("\nRecebendo solicitações na porta 4000...");
            receiveSend();
        }else{
            console.log(`Sensor não encontrado` );
            console.log("\nRecebendo solicitações na porta 4000...");
        }
        
        sql.close()
    }).catch(err => {
        console.log(err);
        sql.close()
        console.log('Falha ao estabelecer conexão com o banco', err);	
    });
    rl.close();
});

io.on('connection', (socket) => {//É mostrado quando alguem se conecta
    console.log("Alguem acessou a página do gráfico >-<"); 
})
