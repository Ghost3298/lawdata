<?php
// Database connection parameters
include 'conn.php';

// Create a new PDO instance for MySQL
try {
    // Set up PDO with error handling
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if required fields are set in the POST request
    if (isset($_POST['cat_id']) && isset($_POST['content_text'])) {
        $cat_id = $_POST['cat_id'];
        $content_text = $_POST['content_text'];

        // File upload handling
        $file_name = null; // Default to null in case no file is uploaded
        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            // Define the allowed file types
            $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            $fileType = $_FILES['file']['type'];
            
            // Validate file type
            if (in_array($fileType, $allowedTypes)) {
                $fileTmpPath = $_FILES['file']['tmp_name'];
                $originalFileName = basename($_FILES['file']['name']);
                
                // Sanitize the file name
                $fileExtension = pathinfo($originalFileName, PATHINFO_EXTENSION);
                $sanitizedFileName = preg_replace('/[^a-zA-Z0-9-_\.]/', '_', pathinfo($originalFileName, PATHINFO_FILENAME));

                // Ensure unique file name
                $file_name = uniqid() . '_' . $sanitizedFileName . '.' . $fileExtension;

                // Upload directory (use server file path, not URL)
                $uploadDir = 'uploads/';
                
                // Ensure the directory exists
                if (!is_dir($uploadDir)) {
                    if (!mkdir($uploadDir, 0777, true)) {
                        echo json_encode(["success" => false, "message" => "Failed to create upload directory."]);
                        exit;
                    }
                }

                // Full path to save the file
                $destination = $uploadDir . $file_name;

                // Move the file to the desired directory
                if (!move_uploaded_file($fileTmpPath, $destination)) {
                    echo json_encode(["success" => false, "message" => "Error moving uploaded file."]);
                    exit;
                }
            } else {
                echo json_encode(["success" => false, "message" => "Invalid file type."]);
                exit;
            }
        }

        // Prepare the SQL statement
        $stmt = $pdo->prepare("INSERT INTO content (cat_id_fk, content_text, document) VALUES (:cat_id, :content_text, :document)");

        // Bind parameters
        $stmt->bindParam(':cat_id', $cat_id, PDO::PARAM_INT);
        $stmt->bindParam(':content_text', $content_text, PDO::PARAM_STR);
        $stmt->bindParam(':document', $file_name, PDO::PARAM_STR);

        // Execute the statement
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Content added successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error adding content."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid input."]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
