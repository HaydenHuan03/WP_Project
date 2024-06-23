<?php
include 'Dbconnect.php';
$database = new Dbconnect();
$conn = $database->connect();

$user = print_r(file_get_contents('php://input'));
$method = $_SERVER['REQUEST_METHOD'];
switch($method){
    case "POST":
        $data = json_decode(file_get_contents("php://input"));
        $email = $data->email;
        $password = $data->password;
        var_dump($data);

        if(!filter_var($email,FILTER_VALIDATE_EMAIL)){
            die("Invalid email format");
        }

        //Hash password
        $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO user_info (email, password) VALUES(:email, :password)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_pass);

        try {
            $stmt->execute();
            echo json_encode(array('message' => 'User registered successfully'));
        } catch(PDOException $e) {
            die("Error: " . $e->getMessage());
        }
}
?>