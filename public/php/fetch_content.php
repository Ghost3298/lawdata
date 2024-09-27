<?php
include 'conn.php'; 

header('Content-Type: application/json'); // Set the content type to JSON

// Create a MySQLi connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Initialize variables for category ID and search term
$cat_id = isset($_GET['cat_id']) && is_numeric($_GET['cat_id']) ? (int)$_GET['cat_id'] : null;
$search_term = isset($_GET['search_term']) ? $_GET['search_term'] : '';

// Prepare the SQL statement
$query = "SELECT * FROM content WHERE 1=1"; // Select all contents by default

if ($cat_id) {
    $query .= " AND cat_id_fk = ?";
}
if ($search_term) {
    $query .= " AND content_text LIKE ?";
}

$query .= " ORDER BY content_text";

// Prepare and execute the statement
$stmt = $conn->prepare($query);

if ($cat_id && $search_term) {
    $search_param = "%" . $search_term . "%"; // For LIKE clause
    $stmt->bind_param('is', $cat_id, $search_param);
} elseif ($cat_id) {
    $stmt->bind_param('i', $cat_id);
} elseif ($search_term) {
    $search_param = "%" . $search_term . "%"; // For LIKE clause
    $stmt->bind_param('s', $search_param);
}

$stmt->execute();

// Get the result
$result = $stmt->get_result();
$contents = $result->fetch_all(MYSQLI_ASSOC);

// Return the contents as JSON
echo json_encode($contents);

// Close the statement and connection
$stmt->close();
$conn->close();
?>
