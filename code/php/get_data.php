<?php
$type = $_GET['type'];

$db = mysqli_connect("localhost", "root", "123456", "management");
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit(500);
}

switch ($type) {
    case 'get_plot_list':
        $result = $db->query("SELECT * FROM plot");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;
    case 'get_room_list':
        $plot_id = $_GET['plot_id'];
        $unit_no = $_GET['unit_no'];
        $building_no = $_GET['building_no'];
        $room_state = $_GET['room_state'];
        $result = $db->query("SELECT * FROM room natural join plot where plot_id like '{$plot_id}'
                                       and unit_no like '{$unit_no}' and building_no like '{$building_no}' and room_state like '{$room_state}'");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;
    case 'get_room_info':
        $room_id = $_GET['room_id'];
        $result = $db->query("SELECT * FROM room natural join plot where room_id = '{$room_id}'");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;

    case 'get_check_in_list':
        $plot_id = $_GET['plot_id'];
        $unit_no = $_GET['unit_no'];
        $building_no = $_GET['building_no'];
        $result = $db->query("SELECT * FROM check_in natural join room natural join plot natural join resident
where plot_id like '{$plot_id}' and unit_no like '{$unit_no}' and building_no like '{$building_no}' and state='1'");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;

    case 'get_check_in_info':
        $result = $db->query("SELECT * FROM check_in_info");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;
    case 'get_resident_list':
        $result = $db->query("SELECT * FROM resident ");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;
    case 'get_staff_list':
        $result = $db->query("SELECT * FROM staff ");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;
    case 'get_basement_list':
        $plot_id = $_GET['plot_id'];
        $unit_no = $_GET['unit_no'];
        $building_no = $_GET['building_no'];
        $state = $_GET['state'];
        $result = $db->query("SELECT * FROM basement natural join plot where plot_id like '{$plot_id}'
                                       and unit_no like '{$unit_no}' and building_no like '{$building_no}' and type like '{$state}'");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;
    case 'get_parking_list':
        $plot_id = $_GET['plot_id'];
        $type = $_GET['parking_type'];
        $state = $_GET['state'];
        $result = $db->query("SELECT * FROM parking natural join stopping_place natural join plot where plot_id like '{$plot_id}'
                                       and type like '{$type}' and state like '{$state}'");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;
    case 'get_parking_resident_list':

        $result = $db->query("SELECT * FROM check_in natural join resident");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;


    case 'get_complain':
        $result = $db->query("SELECT
	complain_id,
	complain.type,
	complain.time,
	description,
	process,
	result,
	plot_name,
	unit_no,
	building_no,
	room_no,
	resident.NAME
FROM
	complain
	JOIN check_in USING(check_in_id)
	NATURAL JOIN resident
	NATURAL JOIN room
	NATURAL JOIN plot order by complain_id");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;


    case 'get_ruzhu_complain':
        $start_time = $_GET['start_time'];
        $end_time = $_GET['end_time'];

        $query = $db->query("SELECT
	resident.NAME as name,
	plot_name,
	unit_no,
	building_no,
	room_no,
	count( * ) AS total_complain 
FROM
	complain
	JOIN check_in USING ( check_in_id )
	NATURAL JOIN resident
	NATURAL JOIN room
	NATURAL JOIN plot 
where unix_timestamp(complain.time) >= unix_timestamp('$start_time') and unix_timestamp(complain.time)<unix_timestamp('$end_time')
GROUP BY
	resident.NAME,
	plot_name,
	unit_no,
	building_no,
	room_no");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);

        echo json_encode($json);
        break;


    case 'get_type_complain':
        $start_time = $_GET['start_time'];
        $end_time = $_GET['end_time'];

        $query = $db->query("SELECT
	type,
	count( * ) AS total_complain 
FROM
	complain 
WHERE
	unix_timestamp( complain.time ) >= unix_timestamp( '$start_time' ) 
	AND unix_timestamp( complain.time ) < unix_timestamp( '$end_time' ) 
GROUP BY
	type");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);

        echo json_encode($json);
        break;

    case 'get_year_complain':
        $query = $db->query("select YEAR(time) as year,MONTH(time) month,count(*) as total_complain
from complain
GROUP BY
YEAR(time),MONTH(time)");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);

        echo json_encode($json);
        break;
    case 'get_check':
        $base_type = $_GET['base_type'];
        $year = $_GET['year'];
        $month = $_GET['month'];


        $query=$db->query("SELECT staff.name as staff_name,plot_name,check_bill.*,basement.*,repair.time as re_time FROM 
                                              check_bill natural join basement natural join plot left outer join staff using (staff_id) left outer join repair using(repair_id)
      
      WHERE year='{$year}' and month='{$month}' and type='{$base_type}'");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);
        echo json_encode($json);
        break;


    case 'add_check':
        $base_type = $_GET['base_type'];
        $year = $_GET['year'];
        $month = $_GET['month'];
        $db->query("Drop table if exists `temp_check`;");
        $db->query("CREATE TEMPORARY TABLE temp_check(year int,month int)");
        $db->query("insert into temp_check value ($year,$month)");
        $insert = $db->query("insert into check_bill(basement_id, year, month) select basement_id,year,month from basement,temp_check where type='{$base_type}'");
        $query = $db->query("SELECT staff.name as staff_name, plot_name,check_bill.*,basement.* FROM check_bill natural join basement natural join plot left outer join staff using (staff_id)
WHERE year='{$year}' and month='{$month}' and type='{$base_type}'");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);
        echo json_encode($json);
        break;

    case 'get_request':
        $result = $db->query("SELECT
	request_id,
    request.time,
       request.repair_id,
	basement.name as basement_name,
       basement.unit_no as basement_unit_no,
       basement.building_no as basement_building_no,
	check_in_info.*,
	repair.time as re_time
FROM
	request
	JOIN check_in_info using (check_in_id)
	JOIN basement using (basement_id) left outer JOIN repair using(repair_id)
	order by request_id");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;


    case 'get_check_in_resident':
        $result = $db->query("SELECT * FROM check_in_info order by plot_name");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;

    case 'get_repair':
        $result = $db->query("SELECT * from repair_info");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;

    case 'get_rent_list':
        $result = $db->query("SELECT * from rent_income_view");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;


    case 'get_ruzhu_request':
        $start_time = $_GET['start_time'];
        $end_time = $_GET['end_time'];

        $query = $db->query("SELECT
	name,
	plot_name,
	unit_no,
	building_no,
	room_no,
	count( * ) AS total_request 
FROM
	request
	JOIN check_in_info USING (check_in_id )
where unix_timestamp(request.time) >= unix_timestamp('$start_time') and unix_timestamp(request.time)<unix_timestamp('$end_time')
GROUP BY
	name,
	plot_name,
	unit_no,
	building_no,
	room_no");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);

        echo json_encode($json);
        break;


    case 'get_type_request':
        $start_time = $_GET['start_time'];
        $end_time = $_GET['end_time'];

        $query = $db->query("SELECT
	name as type,
	count( * ) AS total_request,
       sum(price) as total_cost
FROM
	request natural join basement
WHERE
	unix_timestamp( request.time ) >= unix_timestamp( '$start_time' ) 
	AND unix_timestamp( request.time ) < unix_timestamp( '$end_time' ) 
GROUP BY
	name");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);

        echo json_encode($json);
        break;

    case 'get_type_repair':
        $start_time = $_GET['start_time'];
        $end_time = $_GET['end_time'];
        $query = $db->query("SELECT
	name,
	count( * ) AS total_repair,
       sum(price) as total_cost,
       (count( * )/4) AS damage_rate
FROM
	repair_info
WHERE
	unix_timestamp( repair_info.time ) >= unix_timestamp( '$start_time' ) 
	AND unix_timestamp( repair_info.time ) < unix_timestamp( '$end_time' ) 
GROUP BY
	name");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);

        echo json_encode($json);
        break;


    case 'get_temp_parking':
        $result = $db->query("SELECT * from temp_income_view");
        $json = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode($json);
        break;

    case 'get_bill':
        $year = $_GET['year'];
        $month = $_GET['month'];
        $plot_id = $_GET['plot_id'];
        $unit_no = $_GET['unit_no'];
        $building_no = $_GET['building_no'];
        $process = $_GET['process'];

        $query = $db->query("SELECT * from management_income natural join check_in_info WHERE year='{$year}' and month='{$month}' and plot_name like '{$plot_id}'
                                       and unit_no like '{$unit_no}' and building_no like '{$building_no}' and process like '{$process}'");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);
        echo json_encode($json);
        break;


    case 'add_bill':
        $year = $_GET['year'];
        $month = $_GET['month'];
        $db->query("Drop table if exists `temp_bill`;");
        $db->query("CREATE TEMPORARY TABLE temp_bill(year int,month int,base_income int, rent_income int,process int)");
        $db->query("insert into temp_bill value ($year,$month,'0','0','0')");
        $db->query("insert into management_income(check_in_id, year, month,base_income,rent_income,process) 
select check_in_id,temp_bill.* from check_in,temp_bill where state='1'");
        $db->query("update management_income set base_income=(
  select sum(base_income_info.base_income) from base_income_info where check_in_id=management_income.check_in_id)");
        $db->query("update management_income set rent_income= case 
  when management_income.check_in_id in (select check_in_id from rent) then 50
else 0
end ");
        $query = $db->query("SELECT * from management_income natural join check_in_info WHERE year='{$year}' and month='{$month}'");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);
        echo json_encode($json);
        break;

    case 'get_cost':
        $start_time = $_GET['start_time'];
        $end_time = $_GET['end_time'];

        $query = $db->query("SELECT
	plot_name,
	sum(price) AS total_cost 
FROM
	repair_info
WHERE
	unix_timestamp( repair_info.time ) >= unix_timestamp( '$start_time' ) 
	AND unix_timestamp( repair_info.time ) < unix_timestamp( '$end_time' ) 
GROUP BY
	plot_name");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);

        echo json_encode($json);
        break;

    case 'get_statement':
        $start_time = $_GET['start_time'];
        $end_time = $_GET['end_time'];

        $db->query("Drop table if exists `temp_cost`;");
        $db->query("CREATE TEMPORARY TABLE cost(plot_name varchar(11),cost decimal(10,2),primary key (plot_name))");
        $db->query("CREATE TEMPORARY TABLE bill_income(plot_name varchar(11),bill_income decimal(10,2),primary key (plot_name))");
        $db->query("CREATE TEMPORARY TABLE parking_income(plot_name varchar(11),parking_income decimal(10,2),primary key (plot_name))");
        $query=$db->query("insert into cost VALUE ('A','0'),('B','0'),('C','0')");
        $query=$db->query("insert into bill_income VALUE ('A','0'),('B','0'),('C','0')");
        $query=$db->query("insert into parking_income VALUE ('A','0'),('B','0'),('C','0')");
        $query=$db->query("replace into cost SELECT
	plot_name,sum(price) AS cost FROM repair_info WHERE
	unix_timestamp( repair_info.time ) >= unix_timestamp( '$start_time' ) AND unix_timestamp( repair_info.time ) < unix_timestamp( '$end_time' ) 
GROUP BY plot_name");

        $query = $db->query("replace into parking_income SELECT
	plot_name,sum(price) AS parking_income FROM rent_income_view WHERE
	unix_timestamp( rent_income_view.start_time ) >= unix_timestamp( '$start_time' ) 
	                                                               AND unix_timestamp( rent_income_view.start_time ) < unix_timestamp( '$end_time' ) 
GROUP BY plot_name");

        $query = $db->query("replace into bill_income SELECT
	plot_name,sum(total_income) AS total_cost FROM management_income natural join check_in_info WHERE
	unix_timestamp(concat(year,'-',month,'-15')) >= unix_timestamp( '$start_time' )
	                                                                   AND unix_timestamp(concat(year,'-',month,'-15')) < unix_timestamp( '$end_time' ) 
GROUP BY plot_name");

        $query = $db->query("SELECT
	plot_name,cost,parking_income,bill_income,(bill_income + parking_income - cost) as profit
FROM
	cost natural left outer join parking_income natural join bill_income");
        $json = mysqli_fetch_all($query, MYSQLI_ASSOC);
        echo json_encode($json);
        break;
    case 'get_parking_income':
        $plot=$_GET['plot'];
        $result=$db->query("SELECT * from parking_income_view where plot_name='{$plot}'");
        $json=mysqli_fetch_all($result,MYSQLI_ASSOC);
        echo json_encode($json);
        break;

}
