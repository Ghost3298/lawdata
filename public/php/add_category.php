<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
include 'conn.php'; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $cat_name = $data['cat_name'] ?? '';

    if ($cat_name) {
        // Insert category into the database
        // Assuming $conn is your database connection
        $stmt = $conn->prepare("INSERT INTO categories (cat_name) VALUES (?)");
        $stmt->bind_param("s", $cat_name);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Category added successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to add category."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid category name."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
