<?php
// Include database connection
include 'conn.php'; 

try {
    // Create a PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get the content ID from the request
    $data = json_decode(file_get_contents("php://input"), true);
    $content_id = $data['id'];

    // Check if content ID is valid
    if (!isset($content_id) || empty($content_id)) {
        echo json_encode(["message" => "Invalid content ID."]);
        exit();
    }

    // Prepare the SQL statement to delete the content
    $stmt = $pdo->prepare("DELETE FROM content WHERE id = :id"); // Ensure you have the correct table name
    $stmt->bindParam(':id', $content_id);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["message" => "Content deleted successfully."]);
    } else {
        echo json_encode(["message" => "Failed to delete content."]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

// Close the database connection
$pdo = null;
?>
