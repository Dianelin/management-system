$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_basement_list&plot_id=%&unit_no=%&building_no=%&state=%", function (data) {
        $("#basement_table").html(get_basement_html(data));
    });

    $("#query").on("click", function () {
        let plot_id = $("#selectPlot").val();
        let unit_no = $("#selectUnit").val();
        let building_no = $("#selectBuilding").val();
        let state = $("#selectStatus").val();
        $.getJSON("php/get_data.php?type=get_basement_list&plot_id=" + plot_id + "&unit_no=" + unit_no + "&building_no=" + building_no + "&state=" + state, function (data) {
            $("#basement_table").html(get_basement_html(data));
        });
    });
});

function get_basement_html(data) {
    var html = "";
    $.each(data, function (index, item) {
        console.log(item);
        html +="<tr>";
        html += '<td class="center">' + item.basement_id + '</td>';
        html += '<td class="center">' + item.name + '</td>';
        if (item.type=='0')
            html += '<td class="center">' + '室内' + '</td>';
        else
            html += '<td class="center">' + '室外' + '</td>';

        html += '<td class="center">' + item.price + '</td>';
        html += '<td class="center">' + item.plot_name + '</td>';
        html += '<td class="center">' + item.unit_no + '</td>';
        html += '<td class="center">' + item.building_no + '</td>';
        html += '<td class="center">' + '无' + '</td>';

        html += "<td class=\"center\">\n" +
            "<a class=\"btn btn-info\" href=\"#\"><i class=\"glyphicon glyphicon-edit icon-white\"></i> 编辑</a>\n" +
            "<a class=\"btn btn-danger\" href=\"#\"><i class=\"glyphicon glyphicon-trash icon-white\"></i> 删除</a>\n" +"</td>";
        html +="</tr>";
    });
    return html
}