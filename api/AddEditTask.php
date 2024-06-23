<?php

include 'DbConnect.php';
$db = new Dbconnect();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"), true);



if (!$data || !isset($data['title']) || !isset($data['description']) || !isset($data['subtasks']) || !isset($data['status']) || !isset($data['dueDate']) || !isset($data['column_id']) || !isset($data['type'])) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

$title = $data['title'];
$description = $data['description'];
$subtasks = $data['subtasks'];
$status = $data['status'];
$dueDate = $data['dueDate'];
$column_id = $data['column_id'];
$type = $data['type'];

try {
    switch ($type) {
        case 'add':
            $sql_add_task = "INSERT INTO tasks (column_id, title, description, status, dueDate) VALUES (:column_id, :title, :description, :status, :dueDate)";
            $stmt_add_task = $conn->prepare($sql_add_task);
            $stmt_add_task->execute(['column_id' => $column_id, 'title' => $title, 'description' => $description, 'status' => $status, 'dueDate' => $dueDate]);

            $task_id = $conn->lastInsertId();

            foreach ($subtasks as $subtask) {
                $isCompleted = isset($subtask['isCompleted']) ? $subtask['isCompleted'] : 0;
                $sql_add_subtask = "INSERT INTO subtasks (task_id, title, isCompleted) VALUES (:task_id, :title, :isCompleted)";
                $stmt_add_subtask = $conn->prepare($sql_add_subtask);
                $stmt_add_subtask->execute(['task_id' => $task_id, 'title' => $subtask['title'], 'isCompleted' => $isCompleted]);
            }

            echo json_encode(['success' => true]);
            break;

        case 'edit':
            if (!isset($data['taskId'])) {
                echo json_encode(["error" => "No such task id for edit"]);
                exit;
            }

            $taskId = $data['taskId'];

            $sql_update_task = "UPDATE tasks SET title = :title, description = :description, status = :status, dueDate = :dueDate WHERE id = :task_id";
            $stmt_update_task = $conn->prepare($sql_update_task);
            $stmt_update_task->execute(['title' => $title, 'description' => $description, 'status' => $status, 'dueDate' => $dueDate, 'task_id' => $taskId]);

            $sql_fetch_existing_subtasks = "SELECT id FROM subtasks WHERE task_id = :task_id";
            $stmt_fetch_existing_subtasks = $conn->prepare($sql_fetch_existing_subtasks);
            $stmt_fetch_existing_subtasks->execute(['task_id' => $taskId]);
            $existing_subtasks = $stmt_fetch_existing_subtasks->fetchAll(PDO::FETCH_ASSOC);

            $existing_subtasks_id = array_column($existing_subtasks, 'id');
            $newSubtaskId = array_filter(array_column($subtasks, 'id'));

            $subtasksToDelete = array_diff($existing_subtasks_id, $newSubtaskId);
            foreach ($subtasksToDelete as $subtaskIdToDelete) {
                $sql_delete_subtask = "DELETE FROM subtasks WHERE id = :id";
                $stmt_delete_subtask = $conn->prepare($sql_delete_subtask);
                $stmt_delete_subtask->execute(['id' => $subtaskIdToDelete]);
            }

            // Add or update subtasks
            foreach ($subtasks as $subtask) {
                $isCompleted = isset($subtask['isCompleted']) ? $subtask['isCompleted'] : 0;
                if (isset($subtask['id']) && in_array($subtask['id'], $existing_subtasks_id)) {
                    // Update existing subtask
                    $sql_update_subtask = "UPDATE subtasks SET title = :title, isCompleted = :isCompleted WHERE id = :id";
                    $stmt_update_subtask = $conn->prepare($sql_update_subtask);
                    $stmt_update_subtask->execute(['title' => $subtask['title'], 'isCompleted' => $subtask['isCompleted'], 'id' => $subtask['id']]);
                } else {
                    // Add new subtask
                    $sql_add_subtask = "INSERT INTO subtasks (task_id, title, isCompleted) VALUES (:task_id, :title, :isCompleted)";
                    $stmt_add_subtask = $conn->prepare($sql_add_subtask);
                    $stmt_add_subtask->execute(['task_id' => $taskId, 'title' => $subtask['title'], 'isCompleted' => $isCompleted]);
                }
            }

            echo json_encode(['success' => true]);
            break;

        default:
            echo json_encode(["error" => "Invalid action"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

?>