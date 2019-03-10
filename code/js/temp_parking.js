$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_temp_parking", function (data) {
        $("#temp_parking_table").html(get_temp_html(data));

        function get_temp_html(data) {
            let html = "";

            $.each(data, function (index, item) {
                html += "<tr>";
                html += '<td class="center">' + item.id + '</td>';
                html += '<td class="center">' + item.plot_name + '</td>';
                html += '<td class="center">' + item.sp_name + '</td>';
                html += '<td class="center">' + item.year + '</td>';
                html += '<td class="center">' + item.month + '</td>';
                html += '<td class="center">' + item.income + '</td>';

                html += "<td class=\"center\">\n" +
                    "<a class=\"delete_staff btn btn-danger delete\" id='delete" + item.id + "delete" + item.year + "delete" + item.month + "'><i class=\"glyphicon glyphicon-trash icon-white\"></i> 删除</a>\n" + "</td>";
                html += "</tr>";


            });
            return html
        }

        $('.delete').on('click', function () {
            let parking_id = this.id.split("delete")[1];
            let year = this.id.split("delete")[2];
            let month = this.id.split("delete")[3];

            let formData = {
                parking_id: parking_id,
                year: year,
                month: month
            };

            $.post("php/modify_data.php?type=delete_temp_parking", formData, function (result) {
                if (result === '0') {
                    alert("删除租用失败");
                } else {
                    alert("删除租用成功");
                    window.location.reload();
                }
            });

        });
    });

});
