socket.on('temp', function(data) { //Assim q o temp é recebido

    let dados = data.temp.split(","); //Tranforma as temperaturas recebidas em um vetor de duas posições e usa a virgula como separador
    // o resultado dessa operação será dados = [ 0 : "temperatura", 1 : "umidade"] 

    date.innerHTML = data.date; //Define a data

    //Função para atualizar o gráfico
    updateChart(t1, 0, minTemp, maxTemp);
    updateChart(u1, 1, minUmi, maxUmi);

    //Para evitar a repetição de código
    function updateChart(id, arrayPosition, min, max) {
        if(id.data.labels.length <=  15) { //Se houver menos de 15 dados
            id.data.labels.push(data.time);  //Coloca o horário no eixo X
            id.data.datasets.forEach((dataset) => {
                dataset.data.push(dados[arrayPosition]); //Adiciona a temperatura no eixo Y
            });
        }
        else {
            id.data.labels.shift(); //Remove o primeiro registro de horário
            id.data.labels.push(data.time); //Insere a data atual
            id.data.datasets.forEach((dataset) => {
                dataset.data.shift(); //Remove o primeiro registro de tempertura
                dataset.data.push(dados[arrayPosition]); //Insere um novo registro de temperatura
            });
        }
        id.update(); //Atualiza o gráfico
        
        //Define as máximas e mínimas
        if (dados[arrayPosition] < Number(min.innerHTML)) {            
            min.innerHTML = (dados[arrayPosition]);            
        }else if(dados[arrayPosition] > Number(max.innerHTML)){
            max.innerHTML = (dados[arrayPosition]);
        }
    }
});