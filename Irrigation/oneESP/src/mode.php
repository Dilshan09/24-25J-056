<?php
// Database credentials
$servername = "localhost";  // Replace with your server name or IP
$username = "root";         // Replace with your database username
$password = "";             // Replace with your database password
$dbname = "plant_one";      // Replace with your database name

// Create a connection to the database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch the most recent mode ID
$sql_fetch_fid = "SELECT modeid FROM mode ORDER BY modeid DESC LIMIT 1";
$result = $conn->query($sql_fetch_fid);

// Check if a result was returned
if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo $row['modeid']; // Output the flower ID
} else {
    echo "0"; // Return 0 if no flower ID is found
}

// Close the database connection
$conn->close();
?>
