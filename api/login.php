<?php
include 'Dbconnect.php';

$database = new Dbconnect();
$conn = $database->connect();

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->email) && isset($data->password)) {
        $email = trim($data->email);
        $password = trim($data->password);

        try {
            $sql = "SELECT id, email, password FROM user_info WHERE email = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $hashed_password_from_db = $user['password'];

            if ($user && password_verify($password, $hashed_password_from_db)) {
                $_SESSION['user_id'] = $user['id'];
                
                if (isset($data->rememberMe) && $data->rememberMe) {
                    $cookie_name = "user_login";
                    $cookie_value = $user['id'];
                    $cookie_expiry = time() + (60 * 60);
                    setcookie($cookie_name, $cookie_value, [
                        'expires' => $cookie_expiry,
                        'path' => '/',
                        'domain' => '',
                        'secure' => true,
                        'httponly' => true,
                        'samesite' => 'Strict'
                    ]);
                }
                echo json_encode(array('success' => true, 'user' => $user));
            } else {
                echo json_encode(array('success' => false, 'message' => 'Invalid email or password.'));
            }

        } catch (\Exception $e) {
            echo json_encode(array('success' => false, 'message' => 'Database Error: ' . $e->getMessage()));
        }
    } else {
        echo json_encode(array('success' => false, 'message' => 'Email and password are required.'));
    }
} else {
    echo json_encode(array('success' => false, 'message' => 'Invalid request method.'));
}
?>
