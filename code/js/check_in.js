$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_check_in_list&plot_id=%&unit_no=%&building_no=%", function (data) {
        fill_check_in(data)
    });
    $("#query").on("click", function () {
        let plot_id = $("#selectPlot").val();
        let unit_no = $("#selectUnit").val();
        let building_no = $("#selectBuilding").val();
        $.getJSON("php/get_data.php?type=get_check_in_list&plot_id=" + plot_id + "&unit_no=" + unit_no + "&building_no=" + building_no, function (data) {
            fill_check_in(data);
        });
    });
});

function fill_check_in(data) {
    $("#check_in_table").html(get_check_in_html(data));

    $(".delete_check_in").on('click',function () {
        let check_in_id = this.id.split("check_in")[1];
        let formData = {
            check_in_id: check_in_id,
        };
        $.post("php/modify_data.php?type=delete_check_in", formData, function (result) {
            if (result === '0') {
                alert("删除入住信息失败");
            } else {
                alert("删除入住信息成功");
                window.location.reload();
            }
        });
    });

    function get_check_in_html(data) {
        var html = "";
        $.each(data, function (index, item) {
            html +="<tr>";
            html += '<td class="center">' + item.plot_name + '</td>';
            html += '<td class="center">' + item.unit_no + '</td>';
            html += '<td class="center">' + item.building_no + '</td>';
            html += '<td class="center">' + item.room_no + '</td>';
            html += '<td class="center">' + item.area + '</td>';
            html += '<td class="center">' + item.name + '</td>';
            if(item.gender=='1')
                html += '<td class="center">' + '男' + '</td>';
            else
                html += '<td class="center">' + '女' + '</td>';
            html += '<td class="center">' + item.tel + '</td>';
            html += '<td class="center">' + item.time + '</td>';

            html += "<td class=\"center\">\n" +
                "<button class=\"btn btn-danger delete_check_in\" id='check_in"+item.check_in_id+"'><i class=\"glyphicon glyphicon-trash icon-white\"></i> 删除</button>\n" + "</td>";
            html +="</tr>";
        });
        return html
    }
}

