var socket = io.connect('http://10.0.8.208:4000'); //Se conecta ao servidor

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
        scales: {
            yAxes: [{
                ticks: {
                    // Inclui a °C para o gráfico de Temperatura
                    callback: function(value) {
                        return value + '°C';
                    }
                }
            }]
        }
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
            scales: {
                yAxes: [{
                    ticks: {
                        // Inclui a porcentagem para o gráfico de umidade
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }]
            }
    }
    
});
