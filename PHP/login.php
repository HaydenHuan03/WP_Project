<?php
include 'Dbconnect.php';
$database = new Dbconnect();
$conn = $database->connect();

if($_SERVER['REQUEST_METHOD']==='POST'){
    $data = json_decode(file_get_contents("php://input"));

    if(isset($data->email) && isset($data->password)){
        $email = trim($data->email);
        $password = trim($data->password);

        try{
            $sql = "SELECT email, password FROM user_info WHERE email = :email AND password = :password";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $password);

            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if($user){
                echo json_encode(array('success' => true, 'user' => $user));
            }else{
                echo json_encode(array('success' => false, 'message' => 'Invalid email or password.'));
            }

        }catch(\Exception $e){
            echo json_encode(array('success' => false, 'message' => 'Database Error: ' . $e->getMessage()));
        }
    }else{
        echo json_encode(array('success' => false, 'message' => 'Email and password are required.'));
    }
}else{
    echo json_encode(array('success' => false, 'message' => 'Invalid request method.'));   
}
?>