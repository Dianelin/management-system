$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_request", function (data) {
        console.log(data);
        fill_request(data)
    });
    $.getJSON("php/get_data.php?type=get_check_in_info", function (data) {
        $("#insert_checkin").html(get_checkin_html(data));
    });
    $.getJSON("php/get_data.php?type=get_basement_list&plot_id=%&unit_no=%&building_no=%&state=%", function (data) {
        $("#insert_basement").html(get_basement_html(data));
    });

    $('#request').on('click', function () {
        let basement_id = $("#selectBasement").val().split("basement")[1];
        let check_in_id = $("#selectCheckin").val().split("checkin")[1];

        let formData = {
            basement_id: basement_id,
            check_in_id: check_in_id
        };
        console.log(basement_id);
        $.post("php/add_data.php?type=add_request", formData, function (result) {
            if (result === '0') {
                alert("报修失败");
            } else {
                alert("报修成功");
                window.location.reload();
            }
        });


    });


});

function get_checkin_html(data) {
    var html = '<label class="control-label">选择报修住户</label>';
    html += '<select data-rel="chosen" class="btn-md" id="selectCheckin">';
    $.each(data, function (index, item) {
        html += '<option value="checkin' + item.check_in_id + '">' + item.plot_name + "-"
            + item.unit_no + "单元-" + item.building_no + "号楼-" + "-" + item.room_no + '-' + item.name + '</option>';
    });
    html += '</select>';
    return html
}

function get_basement_html(data) {
    var html = '<label class="control-label">选择报修设施</label>';
    html += '<select data-rel="chosen" class="btn-md" id="selectBasement">';
    $.each(data, function (index, item) {
        html += '<option value="basement' + item.basement_id + '">' + item.plot_name + "-"
            + item.unit_no + "单元-" + item.building_no + "号楼-" + '-' + item.name + '</option>';
    });
    html += '</select>';
    return html
}

function fill_request(data) {
    $("#request_table").html(get_request_html(data));

    // $(".edit").on('click', function () {
    //     let room_id = this.id.split("edit")[1];
    //     console.log(room_id);
    //     $.getJSON("php/get_data.php?type=get_room_info&room_id=" + room_id, function (data) {
    //         let item = data[0];
    //         $("#add_selectPlot").val(item.plot_id);
    //         $("#unit_no").val(item.unit_no);
    //         $("#building_no").val(item.building_no);
    //         $("#room_no").val(item.room_no);
    //         $("#area").val(item.area);
    //         $("html,body").animate({scrollTop: $("#edit_room").offset().top}, 800)
    //     });
    // });
    $(".edit").on('click', function () {
        let request_id = this.id.split("edit")[1];
        console.log(request_id);

        let formData = {
            request_id: request_id
        };

        $.post("php/add_data.php?type=edit_request", formData, function (result) {
            if (result === '0') {
                alert("维修失败");
            } else {
                alert("维修成功");
                window.location.reload();
            }
        });
    });

}

function get_request_html(data) {
    let html = "";
    $.each(data, function (index, item) {
        let state = '待维修';
        if (item.repair_id == null)
            state = '待维修';
        else
            state = '已维修';
        html += "<tr>";
        html += '<td class="center">' + item.request_id + '</td>';
        html += '<td class="center">' + item.basement_name + '</td>';
        html += '<td class="center">' + item.plot_name + '</td>';
        html += '<td class="center">' + item.basement_unit_no + '单元-' + item.basement_building_no + '号楼' + '</td>';
        html += '<td class="center">' + item.unit_no + '单元-' + item.building_no + '号楼-' + item.room_no + ' ' + item.name + '</td>';
        html += '<td class="center">' + item.time.split(" ")[0] + '</td>';

        html += '<td class="center">' + state + '</td>';

        if (item.repair_id == null)
            html += "<td class=\"center\">\n" +
                "<button class='btn btn-info edit' id='edit" + item.request_id + "'><i class='glyphicon glyphicon-edit icon-white'></i>维修 </button>\n" + "</td>";
        else
            html += '<td class="center">' + '-' + '</td>';

        html += "</tr>";
    });
    return html
}

