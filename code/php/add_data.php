<?php
header("Content-Type: text/html;charset=utf-8");
session_start();
$db = mysqli_connect("localhost", "root", "123456", "management");
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit(500);
}
$type = $_GET['type'];


switch ($type) {
    case 'add_room':
        $plot_id = $_POST['plot_id'];
        $unit_no = $_POST['unit_no'];
        $building_no = $_POST['building_no'];
        $room_no = $_POST['room_no'];
        $area = $_POST['area'];
        $query = "INSERT INTO room (unit_no,building_no,room_no,area,plot_id,room_state) VALUE ($unit_no,$building_no,$room_no,$area,$plot_id,0)
ON DUPLICATE KEY UPDATE area='{$area}'";
        if ($db->query($query) === true)
            echo 1;
        else
            echo 0;
        break;

    case 'add_check_in':
        $room_id = $_POST['room_id'];
        $resident_id = $_POST['resident_id'];
        $query = "INSERT INTO check_in (room_id,resident_id,time,state) VALUE ($room_id,$resident_id,'2019-01-04','1')";

        if ($db->query($query) === true) {
            $update = "UPDATE room  set room_state='1' where room_id='{$room_id}'";
            $db->query($update);
            echo 1;
        } else
            echo 0;
        break;

    case 'add_resident':
        $name = $_POST['name'];
        $gender = $_POST['gender'];
        $tel = $_POST['tel'];
        $query = "INSERT INTO resident (name, gender, tel) VALUE ('$name',$gender,$tel)";
        if ($db->query($query) === true)
            echo 1;
        else
            echo 0;
        break;

    case 'add_staff':
        $name = $_POST['name'];
        $gender = $_POST['gender'];
        $tel = $_POST['tel'];
        $query = "INSERT INTO staff VALUE (null, '$name', $gender, $tel)";
        if ($db->query($query) === true)
            echo 1;
        else
            echo 0;
        break;
    case 'add_repair':
        $query = "INSERT INTO repair VALUE ()";
        if ($db->query($query) === true){
            echo 1;
        }
        else
            echo 0;
        break;

    //TODO
    case 'update_request':
        $query = "select max(repair_id) from repair";
        if ($db->query($query) === true){
            echo 1;
        }
        else
            echo 0;
        break;
    case 'update_check':
        $query = "select max(repair_id) from repair";
        if ($db->query($query) === true){
            echo 1;
        }
        else
            echo 0;
        break;
    case 'edit_request':
        $request_id=$_POST['request_id'];
        $update = "UPDATE request set repair_id ='1' where request_id='$request_id'";

        if ($db->query($update) === true) {
            echo 1;
        } else
            echo 0;
        break;


    case 'add_rent_parking':
        $parking_id = $_POST['parking_id'];
        $check_in_id = $_POST['check_in_id'];
        $start_time = $_POST['start_time'];
        $end_time = $_POST['end_time'];
        $totel_month=$_POST['total_month'];

        $result = $db->query("select rent_price from parking NATURAL join stopping_place NATURAL JOIN plot WHERE parking.parking_id='{$parking_id}' ");
        $re = $result->fetch_row();
        $price = $re[0]*floatval($totel_month);

        file_put_contents('log.txt', $price, FILE_APPEND);


        $query = "INSERT INTO rent (start_time,end_time,price,check_in_id,parking_id) VALUE ('$start_time','$end_time','$price',
                                '$check_in_id','$parking_id')";

        if ($db->query($query) === true) {
            $update = "UPDATE parking  set state='1' where parking_id='{$parking_id}'";
            $db->query($update);
            echo 1;
        } else
            echo 0;
        break;

    case 'add_buy_parking':
        $parking_id = $_POST['parking_id'];
        $check_in_id = $_POST['check_in_id'];
        $start_time = $_POST['start_time'];

        $result = $db->query("select buy_price from parking NATURAL join stopping_place NATURAL JOIN plot WHERE parking.parking_id='{$parking_id}' ");
        $re = $result->fetch_row();
        $price = $re[0];

        file_put_contents('log.txt', $price, FILE_APPEND);

        $query = "INSERT INTO rent (start_time,price,check_in_id,parking_id) VALUE ('$start_time','$price','$check_in_id','$parking_id')";

        if ($db->query($query) === true) {
            $update = "UPDATE parking  set state='1' where parking_id='{$parking_id}'";
            $db->query($update);
            echo 1;
        } else
            echo 1;
        break;

    case 'add_complain':
        $complain_type= $_POST['complain_type'];
        $description = $_POST['description'];
        $check_in_id = $_POST['check_in_id'];
        $query = "INSERT INTO complain(check_in_id,description,type) VALUE ('$check_in_id', '$description', '$complain_type')";
        if ($db->query($query) === true)
            echo 1;
        else
            echo 0;
        break;

    case 'add_request':
        $basement_id = $_POST['basement_id'];
        $check_in_id = $_POST['check_in_id'];
        $query = "INSERT INTO request (basement_id, check_in_id) VALUE ('$basement_id',$check_in_id)";

        if ($db->query($query) === true)
            echo 1;
        else
            echo 0;
        break;
}