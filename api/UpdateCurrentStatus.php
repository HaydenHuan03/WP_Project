<?php
include 'DbConnect.php'; // Adjust the path as per your project structure

$db = new Dbconnect();
$conn = $db->connect();

// Receive JSON data from Axios
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['taskId']) || !isset($data['newStatus']) || !isset($data['column_id']) || !isset($data['board_id'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit;
}

$taskId = isset($data['taskId']) ? $data['taskId']: null;
$newStatus = isset($data['newStatus']) ? $data['newStatus']: null;
$column_id = isset($data['column_id']) ? $data['column_id']: null;
$board_id = isset($data['board_id']) ? $data['board_id']:null;

try {
    $sql_fetch_column = "SELECT id FROM columns WHERE name = :newStatus AND board_id = :board_id";
    $stmt_fetch = $conn->prepare($sql_fetch_column);
    $stmt_fetch->bindParam(':newStatus', $newStatus);
    $stmt_fetch->bindParam(':board_id', $board_id);
    $stmt_fetch->execute();

    $updated_column = $stmt_fetch->fetch(PDO::FETCH_ASSOC);

    // Prepare SQL statement to update tasks table
    if($updated_column){
        $updated_column_id = $updated_column['id'];
        $sql = "UPDATE tasks SET status = :newStatus, column_id = :updated_column_id WHERE id = :taskId";
        $stmt = $conn->prepare($sql);
        
        // Bind parameters
        $stmt->bindParam(':newStatus', $newStatus);
        $stmt->bindParam(':updated_column_id', $updated_column_id);
        $stmt->bindParam(':taskId', $taskId);
        $stmt->execute();
    }
} catch (PDOException $e) {
    // Handle PDO exceptions
    echo json_encode(['success' => false, 'message' => 'PDOException: ' . $e->getMessage()]);
}
?>
