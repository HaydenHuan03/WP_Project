<?php

include 'DbConnect.php';
$db = new Dbconnect();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['subtaskId']) || !isset($data['isCompleted'])) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

$subtaskId = $data['subtaskId'];
$isCompleted = $data['isCompleted'];

try {
    $sql_update_subtask = "UPDATE subtasks SET isCompleted = :isCompleted WHERE id = :subtaskId";
    $stmt_update_subtask = $conn->prepare($sql_update_subtask);
    $stmt_update_subtask->execute(['isCompleted' => $isCompleted, 'subtaskId' => $subtaskId]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}


?>