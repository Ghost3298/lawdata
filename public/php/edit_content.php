<?php
require_once 'conn.php'; // Adjust the path as needed

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $cat_id_fk = $_POST['cat_id_fk'];
    $content_text = $_POST['content_text'];

    // Initialize a variable to hold the document name
    $documentName = null;

    // Fetch the current document name before handling the upload
    $sql = "SELECT document FROM content WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->bind_result($currentDocument);
    $stmt->fetch();
    $stmt->close();

    // Handle file upload
    if (isset($_FILES['document']) && $_FILES['document']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        $uploadFile = $uploadDir . basename($_FILES['document']['name']);

        if (move_uploaded_file($_FILES['document']['tmp_name'], $uploadFile)) {
            $documentName = $_FILES['document']['name'];
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file.']);
            exit;
        }
    } else {
        // If no new document is uploaded, keep the current document name
        $documentName = $currentDocument;
    }

    // Update the content in the database
    $sql = "UPDATE content SET cat_id_fk = ?, content_text = ?, document = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('issi', $cat_id_fk, $content_text, $documentName, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Content updated successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating content.']);
    }
    $stmt->close();
}
?>
