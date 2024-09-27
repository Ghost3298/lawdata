<?php
$host = 'sql308.byetcluster.com';
$db = 'if0_37397223_lawdata'; 
$user = 'if0_37397223'; 
$pass = 'seAe0kdOF7JHa3'; // Removed trailing space

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header("Access-Control-Allow-Origin: *"); // Allow access from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization")
?>
