<?php
include 'DbConnect.php';
header("Content-Type: application/json");

$database = new Dbconnect();
$conn = $database->connect();

$data = json_decode(file_get_contents("php://input"), true);
file_put_contents('php://stderr', print_r($data, true));

try {
    $name = isset($data['name']) ? $data['name'] : null;
    $columns = isset($data['columns']) ? $data['columns'] : null;
    $type = isset($data['type']) ? $data['type'] : null;
    $board_id = isset($data['board_id']) ? $data['board_id'] : null;
    $user_id = isset($data['user_id']) ? $data['user_id'] : null;

    if ($type === 'add') {
        // Add new board
        $sql_add_board = "INSERT INTO boards(name, user_id) VALUES(:name, :user_id)";
        $stmt_add_board = $conn->prepare($sql_add_board);
        $stmt_add_board->execute(['name' => $name, 'user_id' => $user_id]);

        // Get the ID of the newly added board
        $board_id = $conn->lastInsertId();

        // Add columns to the new board
        foreach ($columns as $column) {
            $sql_add_column = "INSERT INTO columns(board_id, name) VALUES(:board_id, :name)";
            $stmt_add_columns = $conn->prepare($sql_add_column);
            $stmt_add_columns->execute(['board_id' => $board_id, 'name' => $column['name']]);
        }
    } elseif ($type === 'edit') {
        if (!$board_id) {
            echo json_encode(["error" => "No board ID provided for edit"]);
            exit;
        }

        // Update board name
        $sql_update_board = "UPDATE boards SET name = :name WHERE id = :board_id";
        $stmt_update_board = $conn->prepare($sql_update_board);
        $stmt_update_board->execute(['name' => $name, 'board_id' => $board_id]);

        // Fetch existing columns for the board
        $sql_fetch_existing_column = "SELECT id FROM columns WHERE board_id = :board_id";
        $stmt_fetch_existing_column = $conn->prepare($sql_fetch_existing_column);
        $stmt_fetch_existing_column->execute(['board_id' => $board_id]);
        $existing_columns = $stmt_fetch_existing_column->fetchAll(PDO::FETCH_ASSOC);

        $existingColumnIds = array_column($existing_columns, 'id');
        $newColumnIds = array_column($columns, 'id');

        // Determine which columns to delete
        $columnsToDelete = array_diff($existingColumnIds, $newColumnIds);

        // Delete columns that are no longer needed
        foreach ($columnsToDelete as $columnIdToDelete) {
            $sql_delete_column = "DELETE FROM columns WHERE id = :id";
            $stmt_delete_column = $conn->prepare($sql_delete_column);
            $stmt_delete_column->execute(['id' => $columnIdToDelete]);
        }

        // Add or update columns
        foreach ($columns as $column) {
            if (isset($column['id']) && in_array($column['id'], $existingColumnIds)) {
                // Update existing column
                $sql_update_column = "UPDATE columns SET name = :name WHERE id = :id";
                $stmt_update_column = $conn->prepare($sql_update_column);
                $stmt_update_column->execute(['name' => $column['name'], 'id' => $column['id']]);
            } else {
                // Add new column
                $sql_insert_column = "INSERT INTO columns (board_id, name) VALUES (:board_id, :name)";
                $stmt_insert_column = $conn->prepare($sql_insert_column);
                $stmt_insert_column->execute(['board_id' => $board_id, 'name' => $column['name']]);
            }
        }
    }

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>