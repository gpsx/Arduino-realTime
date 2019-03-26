void setup() {
  Serial.begin(9600); //Conectado a porta serial na frequência de 9600bps.
  delay(1000);
}

void loop() {
  int value = analogRead(A3); //Recebe o valor da temperatura do sensor
  int tempC = value*0.48828125; //Converte a temperatura em ºC
  Serial.println(tempC); //Printa a Temperatura em ºC
  delay(1000); //Aplica um Delay de 1s
}
