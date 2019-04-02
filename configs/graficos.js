var socket = io.connect('http://localhost:4000'); //Se conecta ao servidor

var temper = document.getElementById('temperatura').getContext('2d');
var t1 = new Chart(temper, {
    // O tipo de gráfico que será criado
    type: 'line',
    // As configurações do gráfico
    data: {
    labels: [],
    datasets: [{
        label: "Temperatura",
        borderColor: "#af2828",
        data: [],
        fill: false,
        pointStyle: 'circle',
        backgroundColor: '#af2828',
        pointRadius: 5,
        pointHoverRadius: 7,
        lineTension: 0,
    }]
    },
    // Aqui será Configurado o título do gráfico e deixá-lo responsivo
    options: {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        title: {
            display: true,
            text: 'Gráfico de Temperatura',
            fontSize: 30,
            fontColor: "#af2828",
            fontFamily: " 'ZCOOL XiaoWei', serif",
            fontStyle: "normal"
        },
    }
    
});

var umid = document.getElementById('umidade').getContext('2d');
var u1 = new Chart(umid, {
    // O tipo de gráfico que será criado
    type: 'line',
    // As configurações do gráfico
    data: {
    labels: [],
    datasets: [{
        label: "Umidade",
        borderColor: "#4573a1",
        data: [],
        fill: false,
        pointStyle: 'circle',
        backgroundColor: '#3498DB',
        pointRadius: 5,
        pointHoverRadius: 7,
        lineTension: 0,
    }]
    },
    // Aqui será Configurado o título do gráfico e deixá-lo responsivo
    options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            title: {
                display: true,
                text: 'Gráfico de Umidade',
                fontSize: 30,
                fontColor: "#3498DB",
                fontFamily: " 'ZCOOL XiaoWei', serif",
                fontStyle: "normal"
            },
    }
    
});

socket.on('temp', function(data) { //Assim q o temp é recebido

    let dados = data.temp.split(","); //Tranforma as temperaturas recebidas em um vetor de duas posições e usa a virgula como separador
    // o resultado dessa operação será dados = [ 0 : "temperatura", 1 : "umidade"] 

    date.innerHTML = data.date; //Define a data

    updateChart(t1, 0);
    updateChart(u1, 1);

    //Para evitar a repetição de código
    function updateChart(id, arrayPosition) {
        if(id.data.labels.length != 15) { //Se houver menos de 15 dados
            id.data.labels.push(data.time);  //Coloca o horário no eixo X
            id.data.datasets.forEach((dataset) => {
                dataset.data.push(dados[arrayPosition]); //Adiciona a temperatura no eixo Y
            });
        }
        else {
            id.data.labels.shift(); //Remove o primeiro horário
            id.data.labels.push(data.time); //Insere a data atual
            id.data.datasets.forEach((dataset) => {
                dataset.data.shift(); //Remove o primeiro registro de tempertura
                dataset.data.push(dados[arrayPosition]); //Insere um novo registro de temperatura
            });
        }
        id.update(); //Atualiza o gráfico 
    }
});
