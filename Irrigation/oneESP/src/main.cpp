#include <WiFi.h>
#include <DHT.h>
#include <Adafruit_Sensor.h>
#include <time.h>
#include <vector>
#include <HTTPClient.h>

// WiFi credentials
const char *ssid = "Dialog 4G 924";
const char *password = "401Ea2c5";

// const char *ssid = "Pramu_Dialog 4G";
// const char *password = "Pramudith123";

WiFiClient client;

#define DHTPIN 4
#define DHTTYPE DHT11
#define LEDPIN 26
const int LDRpin = 34;
int lightVal = 0;
bool waterFlow = false;
int flowerId = 0;
int fid;
int modeid;

DHT dht(DHTPIN, DHTTYPE);

// List for sensor readings
std::vector<float> humidityReadings;
std::vector<float> temperatureReadings;
std::vector<int> lightReadings;

// NTP server settings
const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800;
const int daylightOffset_sec = 3600;

// Function prototypes
void readSensors();
void showMenu();
void calculateAverageAndControlMotor();
void scheduleSensorReadings_test();
void scheduleSensorReadings_1();
void scheduleSensorReadings_2();
void scheduleSensorReadings_3();
void turnOnWaterPump(int t);
int fetchFlowerId();
int fetchModeId();
void calculateAverageAndControlMotor_test();
void sendDataToServer_test(int floweId, float avgHumidity, float avgTemperature, int avgLightVal);
void sendDataToServer(int floweId, float avgHumidity, float avgTemperature, int avgLightVal);

void setup()
{
  Serial.begin(9600);
  dht.begin();
  pinMode(LDRpin, INPUT);
  pinMode(LEDPIN, OUTPUT);

  // Connect to WiFi
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");

  // Initialize NTP
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop()
{
restartLoop1:
  // Check in Testing or Actual Mode
  modeid = fetchModeId();
  if (modeid == 0)
  {
    Serial.println(F("  Mode not yet selected!"));
    delay(5000);
    goto restartLoop1;
  }
  else if (modeid == 8)
  {
    fid = 5;
    scheduleSensorReadings_test();
  }
  else if (modeid == 9)
  {
  restartLoop2:
    // Check flower type
    fid = fetchFlowerId();
    if (fid == 0)
    {
      Serial.println(F("  Flower type not yet selected!"));
      delay(5000);
      goto restartLoop2;
    }
    else if (fid == 1)
    {
      scheduleSensorReadings_1();
    }
    else if (fid == 2)
    {
      scheduleSensorReadings_2();
    }
    else if (fid == 3)
    {
      scheduleSensorReadings_3();
    }
    else
    {
      Serial.println(F("Invalid FlowerId received!"));
    }
  }
  else
  {
    Serial.println(F("Invalid ModeID received!"));
    Serial.println(modeid);
  }
  delay(60000); // Check in every 60 seconds if invalid mode detected
}

// Function to fetch the mode ID from the database
int fetchModeId()
{
  // Server IP or domain name with the PHP file
  String serverName = "http://192.168.8.142/oneESP/src/mode.php";

  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(serverName);            // Initialize the HTTP client
    int httpResponseCode = http.GET(); // Send the GET request

    if (httpResponseCode == 200)
    {                                     // Check if the HTTP request was successful
      String response = http.getString(); // Fetch the server response
      response.trim();
      Serial.print("Mode ID fetched: ");
      Serial.println(response); // Use for Debugging (Print the response)
      http.end();               // Close the HTTP connection
      return response.toInt();  // Convert the response to an integer and return
    }
    else
    {
      Serial.print("HTTP request failed with code: ");
      Serial.println(httpResponseCode); // Debugging: Print the HTTP error code
      http.end();                       // Close the HTTP connection
      return -1;                        // Return -1 for HTTP request errors
    }
  }
  else
  {
    Serial.println("WiFi not connected");
    return -1; // Return -1 if WiFi is not connected
  }
}

// Function to fetch the flower ID from the database
int fetchFlowerId()
{
  // Server IP or domain name with the PHP file
  String serverName = "http://192.168.8.142/oneESP/src/flower_data.php";

  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(serverName);            // Initialize the HTTP client
    int httpResponseCode = http.GET(); // Send the GET request

    if (httpResponseCode == 200)
    {                                     // Check if the HTTP request was successful
      String response = http.getString(); // Fetch the server response
      response.trim();
      Serial.print("Flower ID fetched: ");
      Serial.println(response); // Use for dDebugging (Print the response)
      http.end();               // Close the HTTP connection
      return response.toInt();  // Convert the response to an integer and return
    }
    else
    {
      Serial.print("HTTP request failed with code: ");
      Serial.println(httpResponseCode); // Debugging: Print the HTTP error code
      http.end();                       // Close the HTTP connection
      return -1;                        // Return -1 for HTTP request errors
    }
  }
  else
  {
    Serial.println("WiFi not connected");
    return -1; // Return -1 if WiFi is not connected
  }
}

// Function for turn on the water pump
void turnOnWaterPump(int t)
{
  digitalWrite(LEDPIN, HIGH);
  delay(t * 1000);
  digitalWrite(LEDPIN, LOW);
}

// Function to get the current hour and minute
void getCurrentTime(int &currentHour, int &currentMinute)
{
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo))
  {
    Serial.println("Failed to obtain time");
    return;
  }
  currentHour = timeinfo.tm_hour;
  currentMinute = timeinfo.tm_min;
}

// Function to schedule sensor readings based on time slots - Testing
void scheduleSensorReadings_test()
{
  int currentHour, currentMinute;
  getCurrentTime(currentHour, currentMinute);

  // if (waterFlow == false)
  // {
  //   turnOnWaterPump(35); // 3.5seconds
  //   waterFlow = false;
  // }
  turnOnWaterPump(35); // 3.5seconds

  // Start reading every 10 minutes from 7:00 AM to 9:00 AM
  for (int i = 0; i < 10; i++)
  {
    readSensors();
    delay(10000);
  }
  calculateAverageAndControlMotor_test();
  delay(60000);
  modeid = fetchModeId();
  if (modeid == 9)
  {
    ESP.restart();
  }
  scheduleSensorReadings_test();
}

// Function to schedule sensor readings based on time slots - Flower Type I
void scheduleSensorReadings_1()
{
  modeid = fetchModeId();
  if (modeid == 8)
  {
    ESP.restart();
  }
  int currentHour, currentMinute;
  getCurrentTime(currentHour, currentMinute);

  if (currentHour == 7 && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(5);
      waterFlow = false;
    }
    // Start reading every 10 minutes from 7:00 AM to 9:00 AM
    for (int i = 0; i < 11; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_1();
  }
  else if ((currentHour == 9) && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(5);
      waterFlow = false;
    }

    // Between 9:00 AM and 5:00 PM, read every 10 minutes
    for (int i = 0; i < 45; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_1();
  }
  else if (currentHour == 17 && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(3);
      waterFlow = false;
    }
    // Between 5:00 PM and 6:00 PM, read every 10 minutes
    for (int i = 0; i < 5; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_1();
  }
  else if (currentHour == 18 && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(3);
      waterFlow = false;
    }
    // Between 6:00 PM and 7:00 AM, read every 10 minutes
    for (int i = 0; i < 75; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_1();
  }
  else
  {
    Serial.println("Iterating!!!");
    // readSensors();
    // calculateAverageAndControlMotor();
    delay(60000);
    scheduleSensorReadings_1();
  }
}

// Function to schedule sensor readings based on time slots - Flower Type II
void scheduleSensorReadings_2()
{
  modeid = fetchModeId();
  if (modeid == 8)
  {
    ESP.restart();
  }
  int currentHour, currentMinute;
  getCurrentTime(currentHour, currentMinute);

  if (currentHour == 6 && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(8);
      waterFlow = false;
    }
    // Start reading every 10 minutes from 6:00 AM to 8:00 AM
    for (int i = 0; i < 11; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_2();
  }
  else if ((currentHour == 8) && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(8);
      waterFlow = false;
    }

    // Between 8:00 AM and 4:00 PM, read every 10 minutes
    for (int i = 0; i < 45; i++)
    {
      readSensors();
      delay(60000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_2();
  }
  else if (currentHour == 16 && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(5);
      waterFlow = false;
    }
    // Between 4:00 PM and 6:00 PM, read every 10 minutes
    for (int i = 0; i < 11; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_2();
  }
  else if (currentHour == 18 && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(5);
      waterFlow = false;
    }
    // Between 6:00 PM and 6:00 AM, read every 10 minutes
    for (int i = 0; i < 70; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_2();
  }
  else
  {
    Serial.println("Iterating!!!");
    // readSensors();
    // calculateAverageAndControlMotor();
    delay(60000);
    scheduleSensorReadings_2();
  }
}

// Function to schedule sensor readings based on time slots - Flower Type III
void scheduleSensorReadings_3()
{
  modeid = fetchModeId();
  if (modeid == 8)
  {
    ESP.restart();
  }
  int currentHour, currentMinute;
  getCurrentTime(currentHour, currentMinute);

  if (currentHour == 7 && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(7);
      waterFlow = false;
    }
    // Start reading every 10 minutes from 7:00 AM to 9:00 AM
    for (int i = 0; i < 11; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_3();
  }
  else if ((currentHour == 9) && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(7);
      waterFlow = false;
    }

    // Between 9:00 AM and 4:00 PM, read every 10 minutes
    for (int i = 0; i < 40; i++)
    {
      readSensors();
      delay(60000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_3();
  }
  else if (currentHour == 16 && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(5);
      waterFlow = false;
    }
    // Between 4:00 PM and 6:00 PM, read every 10 minutes
    for (int i = 0; i < 11; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_3();
  }
  else if (currentHour == 18 && (0 <= currentMinute <= 5))
  {
    if (waterFlow == true)
    {
      turnOnWaterPump(5);
      waterFlow = false;
    }
    // Between 6:00 PM and 7:00 AM, read every 10 minutes
    for (int i = 0; i < 75; i++)
    {
      readSensors();
      delay(600000);
    }
    calculateAverageAndControlMotor();
    scheduleSensorReadings_3();
  }
  else
  {
    Serial.println("Iterating!!!");
    // readSensors();
    // calculateAverageAndControlMotor();
    delay(60000);
    scheduleSensorReadings_3();
  }
}

// Function to read sensor data and store in lists
void readSensors()
{
  lightVal = analogRead(LDRpin);
  lightVal = map(lightVal, 0, 4095, 0, 1000);
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  flowerId = fid;

  // Store readings in lists
  humidityReadings.push_back(h);
  temperatureReadings.push_back(t);
  lightReadings.push_back(lightVal);

  Serial.print(F("Flower ID: "));
  Serial.print(flowerId);
  Serial.print(F("   Humidity: "));
  Serial.print(h);
  Serial.print(F("%   Temperature: "));
  Serial.print(t);
  Serial.print(F("°C   Light Sensitivity: "));
  Serial.println(lightVal);
}

// Function to calculate average values and clear lists
void calculateAverageAndControlMotor()
{
  int currentHour, currentMinute;
  getCurrentTime(currentHour, currentMinute);
  float avgHumidity = 0, avgTemperature = 0;
  int avgLightVal = 0;

  for (float h : humidityReadings)
    avgHumidity += h;
  for (float t : temperatureReadings)
    avgTemperature += t;
  for (int l : lightReadings)
    avgLightVal += l;

  avgHumidity /= humidityReadings.size();
  avgTemperature /= temperatureReadings.size();
  avgLightVal /= lightReadings.size();

  if (flowerId == 1 && avgTemperature >= 20 && avgTemperature <= 28 &&
      avgHumidity >= 70 && avgHumidity <= 90 &&
      avgLightVal >= 300 && avgLightVal <= 600 &&
      currentHour >= 9 && currentHour <= 18)
  {
    waterFlow = true;
  }
  else if (flowerId == 1 && avgTemperature >= 20 && avgTemperature <= 28 &&
           avgHumidity >= 70 && avgHumidity <= 90 &&
           avgLightVal >= 400 && avgLightVal <= 900 &&
           currentHour >= 18 && currentHour <= 9)
  {
    waterFlow = true;
  }
  else if (flowerId == 2 && avgTemperature >= 22 && avgTemperature <= 30 &&
           avgHumidity >= 75 && avgHumidity <= 95 &&
           avgLightVal >= 900 && avgLightVal <= 1400 &&
           currentHour >= 6 && currentHour <= 18)
  {
    waterFlow = true;
  }
  else if (flowerId == 2 && avgTemperature >= 22 && avgTemperature <= 30 &&
           avgHumidity >= 75 && avgHumidity <= 95 &&
           avgLightVal >= 700 && avgLightVal <= 1000 &&
           currentHour >= 18 && currentHour <= 8)
  {
    waterFlow = true;
  }
  else if (flowerId == 3 && avgTemperature >= 18 && avgTemperature <= 28 &&
           avgHumidity >= 65 && avgHumidity <= 85 &&
           avgLightVal >= 700 && avgLightVal <= 1100 &&
           currentHour >= 9 && currentHour <= 18)
  {
    waterFlow = true;
  }
  else if (flowerId == 3 && avgTemperature >= 18 && avgTemperature <= 28 &&
           avgHumidity >= 65 && avgHumidity <= 85 &&
           avgLightVal >= 400 && avgLightVal <= 700 &&
           currentHour >= 18 && currentHour <= 9)
  {
    waterFlow = true;
  }
  else
  {
    waterFlow = false;
  }

  // Send average values to MySQL via HTTP
  sendDataToServer(flowerId, avgHumidity, avgTemperature, avgLightVal);

  // Clear lists for the next period
  humidityReadings.clear();
  temperatureReadings.clear();
  lightReadings.clear();
}

// Function to send data to server
void sendDataToServer(int id, float h, float t, int lightVal)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;

    // Your server IP or domain name with the PHP file
    String serverName = "http://192.168.8.142/oneESP/src/insert_data.php";

    http.begin(serverName);

    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    // Prepare the data to send in POST request
    String httpRequestData = "flowerid=" + String(id) + "&humidity=" + String(h) + "&temperature=" + String(t) + "&light=" + String(lightVal);

    // Send POST request
    int httpResponseCode = http.POST(httpRequestData);

    // Check for response
    if (httpResponseCode > 0)
    {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    }
    else
    {
      Serial.println("Error in sending POST request: " + String(httpResponseCode));
    }

    // End the HTTP connection
    http.end();
  }
  else
  {
    Serial.println("WiFi Disconnected");
  }
}

// Function to calculate average values and clear lists - Testing
void calculateAverageAndControlMotor_test()
{
  int currentHour, currentMinute;
  getCurrentTime(currentHour, currentMinute);
  float avgHumidity = 0, avgTemperature = 0;
  int avgLightVal = 0;

  for (float h : humidityReadings)
    avgHumidity += h;
  for (float t : temperatureReadings)
    avgTemperature += t;
  for (int l : lightReadings)
    avgLightVal += l;

  avgHumidity /= humidityReadings.size();
  avgTemperature /= temperatureReadings.size();
  avgLightVal /= lightReadings.size();

  if (flowerId == 5 && avgTemperature >= 20 && avgTemperature <= 28 &&
      avgHumidity >= 70 && avgHumidity <= 90 &&
      avgLightVal >= 300 && avgLightVal <= 600 &&
      currentHour >= 9 && currentHour <= 18)
  {
    waterFlow = true;
  }
  else if (flowerId == 5 && avgTemperature >= 20 && avgTemperature <= 28 &&
           avgHumidity >= 70 && avgHumidity <= 90 &&
           avgLightVal >= 400 && avgLightVal <= 900 &&
           currentHour >= 18 && currentHour <= 9)
  {
    waterFlow = true;
  }
  else
  {
    waterFlow = false;
  }

  // Send average values to MySQL via HTTP - Testing
  sendDataToServer_test(flowerId, avgHumidity, avgTemperature, avgLightVal);

  // Clear lists for the next period
  humidityReadings.clear();
  temperatureReadings.clear();
  lightReadings.clear();
}

// Function to send data to server - Testing
void sendDataToServer_test(int id, float h, float t, int lightVal)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;

    // Your server IP or domain name with the PHP file
    String serverName = "http://192.168.8.142/oneESP/src/insert_data_test.php";

    http.begin(serverName);

    http.addHeader("Content-Type", "application/x-www-form-urlencoded");

    // Prepare the data to send in POST request
    String httpRequestData = "flowerid=" + String(id) + "&humidity=" + String(h) + "&temperature=" + String(t) + "&light=" + String(lightVal);

    // Send POST request
    int httpResponseCode = http.POST(httpRequestData);

    // Check for response
    if (httpResponseCode > 0)
    {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    }
    else
    {
      Serial.println("Error in sending POST request: " + String(httpResponseCode));
    }

    // End the HTTP connection
    http.end();
  }
  else
  {
    Serial.println("WiFi Disconnected");
  }
}
