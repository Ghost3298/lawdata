<?php
// Include database connection
include 'conn.php'; 

try {
    // Create a PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get the category ID from the request
    $data = json_decode(file_get_contents("php://input"), true);
    $category_id = $data['id'];

    // Prepare the SQL statement to delete the category
    $stmt = $pdo->prepare("DELETE FROM categories WHERE id = :id");
    $stmt->bindParam(':id', $category_id);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["message" => "Category deleted successfully."]);
    } else {
        echo json_encode(["message" => "Failed to delete category."]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

// Close the database connection
$pdo = null;
?>