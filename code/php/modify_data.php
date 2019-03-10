<?php
session_start();
$db = mysqli_connect("localhost", "root", "123456", "management");
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit(500);
}
$type = $_GET['type'];


switch ($type) {
    case 'delete_check_in':
        $check_in_id = $_POST['check_in_id'];
        $update_check_in = "UPDATE check_in  set state='0' where check_in_id='{$check_in_id}'";
        $update_room = "UPDATE room  set room_state='0' where room_id in (select room_id from check_in where check_in_id='{$check_in_id}')";

        if ($db->query($update_room) === true and $db->query($update_check_in) == true)
            echo 1;
        else
            echo 0;
        break;

    case 'delete_staff':
        $staff_id = $_POST['staff_id'];
        $update = "delete from staff where staff_id='{$staff_id}'";

        if ($db->query($update) === true)
            echo 1;
        else
            echo 0;
        break;

    case 'delete_rent':
        $rent_id = $_POST['rent_id'];
        $update = "delete from rent where rent_id='$rent_id'";

        if ($db->query($update) === true) {

            $del = "UPDATE parking set state='0' where parking_id=
        (select parking_id from rent where rent_id='{$rent_id}' )";

            $db->query($del);
            echo 1;
        } else
            echo 0;
        break;

    case 'delete_complain':
        $complain_id = $_POST['complain_id'];
        $update = "delete from complain where complain_id='{$complain_id}'";

        if ($db->query($update) === true)
            echo 1;
        else
            echo 0;
        break;
    case 'delete_temp_parking':
        $parking_id = $_POST['parking_id'];
        $year=$_POST['year'];
        $month=$_POST['month'];

        $update = "delete from temp_income where parking_id='{$parking_id}' and year='{$year}' and month='{$month}'";

        if ($db->query($update) === true)
            echo 1;
        else
            echo 0;
        break;

    case 'update_bill_process':
        $m_id = $_POST['m_id'];
        $update = "UPDATE management_income set process='1' where management_income.m_id='$m_id'";

        if ($db->query($update) === true) {
            echo 1;
        } else
            echo 0;
        break;

}