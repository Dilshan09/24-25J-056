<?php
// Database credentials
$servername = "localhost";  // Assuming the PHP script runs on the same machine as the MySQL server
$username = "root";  // MySQL username
$password = "";  // MySQL password
$dbname = "plant_one";  // Database name

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//echo "Database connection is OK"; 

$flowerid = $_POST['flowerid']; 
$humidity = $_POST['humidity'];
$temperature = $_POST['temperature'];
$light = $_POST['light'];

// Prepare SQL query for insertion
$sql = "INSERT INTO sensor_data_test (flowerid, humidity, temperature, light) VALUES ('$flowerid', '$humidity', '$temperature', '$light')";

// Execute the query
if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close the connection
$conn->close();
?>
