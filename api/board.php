<?php

include 'DbConnect.php';
header("Content-Type: application/json");

$user_id = $_GET['user_id'];

if (!$user_id) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

try{
    $database = new Dbconnect();
    $conn = $database->connect();

    $sql_boards = "SELECT * FROM boards WHERE user_id = :user_id";
    $stmt_boards = $conn->prepare($sql_boards);
    $stmt_boards->execute(['user_id' => $user_id]);
    $boards = [];

    while($row_board = $stmt_boards->fetch(PDO::FETCH_ASSOC)){
        $board_id = $row_board['id'];
        $board = [
            "id" => $board_id,
            "name" => $row_board['name'],
            "columns" => []
        ];

        $sql_columns = "SELECT * FROM columns WHERE board_id = :board_id";
        $stmt_columns = $conn->prepare($sql_columns);
        $stmt_columns->execute(['board_id' => $board_id]);

        while($row_column = $stmt_columns->fetch(PDO::FETCH_ASSOC)){
            $column_id = $row_column['id'];
            $column = [
                "id" => $column_id,
                "name" => $row_column['name'],
                "tasks" => []
            ];

            $sql_tasks = "SELECT * FROM tasks WHERE column_id = :column_id";
            $stmt_tasks = $conn->prepare($sql_tasks);
            $stmt_tasks->execute(['column_id' => $column_id]);               

            while($row_task = $stmt_tasks->fetch(PDO::FETCH_ASSOC)){
                $task_id = $row_task['id'];
                $task =[
                    "id" => $task_id,
                    "title" => $row_task['title'],
                    "description" => $row_task["description"],
                    "status" => $row_task['status'],
                    'dueDate' => $row_task['dueDate'],
                    'subtasks' => []
                ];

                $sql_subtasks = "SELECT * FROM subtasks WHERE task_id = :task_id";
                $stmt_subtasks = $conn->prepare($sql_subtasks);
                $stmt_subtasks->execute(['task_id' => $task_id]);

                while($row_subtask = $stmt_subtasks->fetch(PDO::FETCH_ASSOC)){
                    $subtask = [
                        "id" => $row_subtask['id'],
                        "title" => $row_subtask['title'],
                        "isCompleted" => (bool)$row_subtask['isCompleted']
                    ];
                    $task['subtasks'][] = $subtask;
                }
                $column['tasks'][] = $task;
            }
            $board['columns'][] = $column;
        }
        $boards[] = $board;
    }
    echo json_encode(["boards" => $boards]);
}catch(\Exception $e){
    echo json_encode(["error" => $e->getMessage()]);
}



?>