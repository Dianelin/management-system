$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_repair", function (data) {
        console.log(data);
        fill_request(data)
    });


});

function fill_request(data) {
    $("#repair_table").html(get_repair_html(data));

    $(".edit").on('click', function () {
        let room_id = this.id.split("edit")[1];
        console.log(room_id);
        $.getJSON("php/get_data.php?type=get_room_info&room_id=" + room_id, function (data) {
            let item = data[0];
            $("#add_selectPlot").val(item.plot_id);
            $("#unit_no").val(item.unit_no);
            $("#building_no").val(item.building_no);
            $("#room_no").val(item.room_no);
            $("#area").val(item.area);
            $("html,body").animate({scrollTop: $("#edit_room").offset().top}, 800)
        });
    });

}

const type_trans={'0':'室内','1':'室外'};
function get_repair_html(data) {
    let html = "";
    $.each(data, function (index, item) {
        html += "<tr>";
        html += '<td class="center">' + item.repair_id + '</td>';
        html += '<td class="center">' + item.name + '</td>';
        html += '<td class="center">' + type_trans[item.type] + '</td>';
        html += '<td class="center">' + item.plot_name + '</td>';
        html += '<td class="center">' + item.unit_no+'</td>';
        html += '<td class="center">' + item.building_no+'号楼'+'</td>';
        html += '<td class="center">' + item.price+'</td>';
        html += '<td class="center">' + item.time.split(" ")[0] + '</td>';
        html += '<td class="center">' + item.staff_name + '</td>';

        html += "<td class=\"center\">\n" +
            "<button class='btn btn-info edit' id='edit" + item.room_id + "'><i class='glyphicon glyphicon-edit icon-white'></i> 编辑</button>\n" + "</td>";
        html += "</tr>";
    });
    return html
}

