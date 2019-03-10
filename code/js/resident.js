$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_resident_list", function (data) {
        $("#resident_table").html(get_resident_html(data));
    });
    $("#add_resident").on("click", function () {
        let formData = {
            name: $("#name").val(),
            gender:$("input[name='gender']:checked").val(),
            tel: $("#tel").val()
        };
        console.log(formData);
        $.post("php/add_data.php?type=add_resident", formData, function (result) {
            if (result === '0') {
                alert("新增住户失败");
            } else {
                alert("新增住户成功");
                window.location.reload();
            }

        });
    });
});

function get_resident_html(data) {
    var html = "";
    $.each(data, function (index, item) {
        html +="<tr>";
        html += '<td class="center">' + item.name + '</td>';
        if(item.gender=='1')
            html += '<td class="center">' + '男' + '</td>';
        else
            html += '<td class="center">' + '女' + '</td>';
        html += '<td class="center">' + item.tel + '</td>';

        html += "<td class=\"center\">\n" +
            "<a class=\"btn btn-info\" href=\"#\"><i class=\"glyphicon glyphicon-edit icon-white\"></i> 编辑</a>\n" + "</td>";
        html +="</tr>";
    });
    return html
}