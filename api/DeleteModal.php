<?php

include 'DbConnect.php';
$db = new Dbconnect();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['type']) || !isset($data['id'])) {
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

$type = $data['type'];
$id = $data['id'];

try {
    switch ($type) {
        case 'board':
            $sql_delete_board = "DELETE FROM boards WHERE id = :id";
            $stmt = $conn->prepare($sql_delete_board);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            echo json_encode(["message" => "Board deleted successfully"]);
            break;

        case 'task':
            $sql_delete_task = "DELETE FROM tasks WHERE id = :id";
            $stmt = $conn->prepare($sql_delete_task);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            echo json_encode(["message" => "Task deleted successfully"]);
            break;

        default:
            echo json_encode(["error" => "Invalid type"]);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

$conn = null; // Close the database connection

?>
