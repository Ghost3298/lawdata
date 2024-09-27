<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'conn.php'; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;
    $cat_name = $data['cat_name'] ?? '';

    if ($id && $cat_name) {
        // Prepare and bind
        $stmt = $conn->prepare("UPDATE categories SET cat_name = ? WHERE id = ?");
        $stmt->bind_param("si", $cat_name, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Category updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update category."]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Invalid input data."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}

$conn->close();
?>
