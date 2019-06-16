var express = require('express'); //Recupera o modulo Serial express

var app = express();

var path = require('path'); //Recupera o modulo path, que vem junto do express

var sql = require('mssql');

var server = app.listen(4000, () => { //Inicia o servidor na porta 4000
})

var io = require('socket.io')(server); //Recupera o modulo so socket.io e atrela o socket.io ao nosso servidor express.

let sensor, table, notifications, nLimitation = 5;

let counter = 0;

app.use(express.static('public')); //Send index.html page on GET /

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const config = {
	user: 'aluno01191029',
	password: '#Gf42784062821',
	server: 'gabrielbiussi.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
	database: 'BancoProjeto1',
 
	options: {
		encrypt: true // Use this if you're on Windows Azure
	}
}


const SerialPort = require('serialport'); //Recupera o modulo Serial Port

pickPort = ()=>{
    SerialPort.list().then(entradas_seriais => {

        // este bloco trata a verificação de Arduino conectado (inicio)
    
        var entradas_seriais_arduino = entradas_seriais.filter(entrada_serial => {
            return entrada_serial.vendorId == 2341 && entrada_serial.productId == 43;
        });
    
        if (entradas_seriais_arduino.length != 1) {
            throw new Error("Nenhum Arduino está conectado ou porta USB sem comunicação ou mais de um Arduino conectado");
        }
    
        return entradas_seriais_arduino[0].comName;
    
    
        // este bloco trata a verificação de Arduino conectado (fim)
    
    }).then(ArduinoCon => {
        receiveSend(ArduinoCon);
    })
}

function receiveSend(porta) {
    const Readline = SerialPort.parsers.Readline; // Atribui o metodo readline do serial port a variável ReadLine
    const port = new SerialPort(`COM5`); //Conecta a porta serial COM5. Veja a sua na IDE do Arduino -> Tools -> Port

    const parser = port.pipe(new Readline({delimiter: '\r\n'})); //Lê a linha apenas se uma nova linhas for inserida
    parser.on('data', (data) => { //Na recepção dos dados = "On data retrieving"
        notifications = [
            'A temperatura está em 90% do limite',
            'A temperatura está em 10% do limite',
            'A Umidade está em 90% do limite',
            'A Umidade está em 10% do limite',
            `Verifique o sensor com localização ${sensor.Local}`
        ]
        ut = data.split(',');
        ut[0] = parseInt(ut[0]);
        ut[1] = parseInt(ut[1]);
        temp = ut[0];

        rangeT = sensor.TempMax - sensor.TempMin;
        rangeU = sensor.UmidMax - sensor.UmidMin;

        t90 = Number(sensor.TempMin) + (rangeT * .9)
        t10 = Number(sensor.TempMin) + (rangeT * .1)

        u90 = Number(sensor.UmidMin) + (rangeU * .9)
        u10 = Number(sensor.UmidMin) + (rangeU * .1)

        console.log(rangeT, rangeU, t90, t10, u90, u10)

        verifyTable();

        console.log('Temperatura:',ut[0],'°C','Umidade:',ut[1],'%\n')
        var datahora = new Date();//Pega a data do sistema 

        data = datahora.getDate()+"/"+(Number(datahora.getMonth())+1)+"/"+datahora.getFullYear(); //Transforma em uma data legível 1/4/2019

        hora = (datahora.getHours())+":"+(datahora.getMinutes()); //Transforma em uma hora legível 15:00

        io.sockets.emit('temp', {date: data, time: hora, temp:data}); //Emite o objeto temp, com os atributos date, time e temp
        //sql.close()
        sql.connect(config, err => {
            // ... error checks
        
            const request = new sql.Request()
            request.stream = true // You can set streaming differently for each request
            request.query(`INSERT INTO ${table}(Temperatura, Umidade, Sensor_Id, DataDMA, Hora) VALUES ('${ut[0]}', '${ut[1]}', ${sensor.Id}, '${data}', '${hora}')`) // or request.execute(procedure)
        
            request.on('error', err => {
                console.log(err)
                sql.close();
            })
            request.on('done', result => {
                console.log('Dados registrados com sucesso');
                sql.close();
                if (table != 'Alerta') {
                    verifyNotification();
                }
            })
            
        })
    });   
}



queryArd = ()=>{
    rl.question('Qual o código do seu sensor?', (answer) => {
        // TODO: Log the answer in a database
        sql.close()
        sql.connect(config).then(() => {
            return sql.query`Select * from Sensor where Codigo = ${answer}`
        }).then(result => {     
            sql.close();           
            if (result.rowsAffected > 0) {
                sensor = result.recordset[0];
                console.log("Sensor Encontrado", sensor.Local);
                console.log("\nRecebendo solicitações na porta 4000...");
                receiveSend();
            }else{
                console.log(`Sensor não encontrado` );
                console.log("\nRecebendo solicitações na porta 4000...");
                queryArd();
            }
        }).catch(err => {
            console.log(err);
            sql.close()
            console.log('Falha ao estabelecer conexão com o banco', err);	
        });
        rl.close();
    });
}
queryArd();

notification = (Index)=>{
    console.log(notifications[Index]);
    Index == 2 || Index == 3 ? counter = 0 : true
    sql.close()
    sql.connect(config, err => {
        // ... error checks
     
        const request = new sql.Request()
        request.stream = true // You can set streaming differently for each request
        request.query(`INSERT INTO notificacoes(Mensagem, Estado, Cliente_id) VALUES ('${notifications[Index]}', 'ativo', ${sensor.Cliente_Id})`) // or request.execute(procedure)
     
        request.on('error', err => {
            console.log(err)
        })
        request.on('done', result => {
            console.log('Dados registrados com sucesso');
            sql.close();
        })
        
    })
}
async function verifyTable() {
    if (ut[0] < sensor.TempMin || ut[0] > sensor.TempMax || ut[1] < sensor.UmidMin || ut[0] > sensor.UmidMax) {
        table = 'Alerta';
        console.log('\nPassou Dos limites');
        await notification(4);
    }
    else {
        table = 'Historico';
    }
}

async function verifyNotification() {
    if (ut[0] >= t90) {
       console.log("A", counter);      
        if(counter == nLimitation){
            await notification(0);
        }
    }
    else if (ut[0] <= t10) {
        console.log("a", counter);
        
        if(counter == nLimitation){
            await notification(1);
        }
    }
    if (ut[1] >= u90) {
        console.log("B", counter);    
        if(counter == nLimitation){
            await notification(2);
        }
    }
    else if (ut[1] <= u10) {
        console.log("b", counter);       
        if(counter == nLimitation){
            await notification(3);
        }
    }
    counter++;
}
io.on('connection', (socket) => {//É mostrado quando alguem se conecta
    console.log("Alguem acessou a página do gráfico >-<"); 
})
