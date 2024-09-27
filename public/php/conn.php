<?php

header("Access-Control-Allow-Origin: *"); // Allows all origins
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allows specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type"); // Allows specific headers

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Your database connection code
$host = 'sql308.infinityfree.com';
$db = 'if0_37397223_lawdata'; 
$user = 'if0_37397223'; 
$pass = 'seAe0kdOF7JHa3'; 

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
