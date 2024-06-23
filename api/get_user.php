<?php
include 'Dbconnect.php';

$database = new Dbconnect();
$conn = $database->connect();

if (isset($_GET['id'])) {
    $userId = $_GET['id'];

    try {
        $sql = "SELECT id, email FROM user_info WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $userId);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode(array('success' => true, 'user' => $user));
        } else {
            echo json_encode(array('success' => false, 'message' => 'User not found.'));
        }

    } catch (\Exception $e) {
        echo json_encode(array('success' => false, 'message' => 'Database Error: ' . $e->getMessage()));
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'User ID is required.'));
}
?>