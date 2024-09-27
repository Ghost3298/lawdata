<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database connection
include 'conn.php';

// Fetch categories
$sql = "SELECT id, cat_name FROM categories ORDER BY cat_name";
$result = $conn->query($sql);

if (!$result) {
    // Handle the error
    $error = ['error' => 'Database query failed: ' . $conn->error];
    header('Content-Type: application/json');
    echo json_encode($error);
    $conn->close();
    exit;
}

$categories = [];
if ($result->num_rows > 0) {
    // Fetch all categories
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($categories);

// Close connection
$conn->close();
?>
