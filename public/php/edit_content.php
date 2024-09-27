<?php
header('Content-Type: application/json');
include 'conn.php';

// Check if POST request is made
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $cat_id = $_POST['cat_id'];
    $content_text = $_POST['content_text'];

    // Handle file upload if a new document is provided
    if (isset($_FILES['document']) && $_FILES['document']['error'] === UPLOAD_ERR_OK) {
        $target_dir = "uploads/";
        $target_file = $target_dir . basename($_FILES["document"]["name"]);
        $uploadOk = 1;

        // Check if file is an actual document
        $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        $allowedTypes = ['pdf', 'doc', 'docx', 'txt']; // Allowed file types
        if (!in_array($fileType, $allowedTypes)) {
            $uploadOk = 0;
            echo json_encode(['success' => false, 'message' => 'Sorry, only PDF, DOC, DOCX & TXT files are allowed.']);
            exit;
        }

        // Try to upload file
        if ($uploadOk == 1) {
            if (move_uploaded_file($_FILES["document"]["tmp_name"], $target_file)) {
                $documentPath = basename($_FILES["document"]["name"]);
                // Update database with new document path
                $stmt = $conn->prepare("UPDATE content SET cat_id = ?, content_text = ?, document = ? WHERE id = ?");
                $stmt->bind_param("sssi", $cat_id, $content_text, $documentPath, $id);
            } else {
                echo json_encode(['success' => false, 'message' => 'Sorry, there was an error uploading your file.']);
                exit;
            }
        }
    } else {
        // Update without changing the document
        $stmt = $conn->prepare("UPDATE content SET cat_id = ?, content_text = ? WHERE id = ?");
        $stmt->bind_param("ssi", $cat_id, $content_text, $id);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Content updated successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating content: ' . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
