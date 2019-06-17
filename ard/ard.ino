void setup() {
  // put your setup code here, to run once:

}

void loop() {
  Serial.print(random(21,27));
  Serial.print(',');
  Serial.println(random(50,80));
  delay(30000);
}
