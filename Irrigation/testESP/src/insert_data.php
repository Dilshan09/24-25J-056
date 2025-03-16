<?php
$servername = "localhost";  // Server name or IP address
$username = "root";      // MySQL username
$password = "";  // MySQL password
$dbname = "plant_one";      // MySQL database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get data from the POST request
$humidity = $_POST['humidity'];
$temperature = $_POST['temperature'];
$light = $_POST['light'];

// Prepare and execute SQL query
$sql = "INSERT INTO sensor_data (humidity, temperature, light) VALUES ('$humidity', '$temperature', '$light')";
if ($conn->query($sql) === TRUE) {
  echo "Data inserted successfully";
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
