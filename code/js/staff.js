$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_staff_list", function (data) {
        fill_staff(data);
    });
    $("#add_staff").on("click", function () {
        let formData = {
            name: $("#staff_name").val(),
            gender:$("input[name='gender']:checked").val(),
            tel: $("#tel").val()
        };
        console.log(formData);
        $.post("php/add_data.php?type=add_staff", formData, function (result) {
            if (result === '0') {
                alert("新增工作人员失败");
            } else {
                alert("新增工作人员成功");
                window.location.reload();
            }

        });
    });
});

function fill_staff(data) {
    $("#staff_table").html(get_staff_html(data));

    $(".delete_staff").on('click',function () {
        let staff_id = this.id.split("staff")[1];
        let formData = {
            staff_id: staff_id,
        };
        console.log(staff_id);
        $.post("php/modify_data.php?type=delete_staff", formData, function (result) {
            if (result === '0') {
                alert("删除工作人员信息失败");
            } else {
                alert("删除工作人员信息成功");
                window.location.reload();
            }
        });
    });

    function get_staff_html(data) {
        var html = "";
        $.each(data, function (index, item) {
            html +="<tr>";
            html += '<td class="center">' + item.staff_id + '</td>';
            html += '<td class="center">' + item.name + '</td>';
            if(item.gender==='1')
                html += '<td class="center">' + '男' + '</td>';
            else
                html += '<td class="center">' + '女' + '</td>';
            html += '<td class="center">' + item.tel + '</td>';

            html += "<td class=\"center\">\n" +
                "<a class=\"btn btn-info\" ><i class=\"glyphicon glyphicon-edit icon-white\"></i> 编辑</a>\n" +
                "<a class=\"delete_staff btn btn-danger\" id='staff"+item.staff_id+"'><i class=\"glyphicon glyphicon-trash icon-white\"></i> 删除</a>\n" +"</td>";
            html +="</tr>";
        });
        return html
    }
}
