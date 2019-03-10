$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_rent_list", function (data) {
        $("#rent_table").html(get_rent_html(data));

        function get_rent_html(data) {
            let html = "";

            $.each(data, function (index, item) {
                html += "<tr>";
                html += '<td class="center">' + item.id + '</td>';
                html += '<td class="center">' + item.plot_name + '</td>';
                html += '<td class="center">' + item.sp_name + '</td>';
                html += '<td class="center">' + item.NAME + '</td>';
                html += '<td class="center">' + item.tel + '</td>';
                html += '<td class="center">' + item.start_time + '</td>';
                html += '<td class="center">' + item.end_time + '</td>';
                html += '<td class="center">' + item.price + '</td>';


                html += "<td class=\"center\">\n" +
                    "<button class='btn btn-danger delete' id='delete" + item.id + "'><i class='glyphicon glyphicon-edit icon-white'></i> 删除</button>\n" + "</td>";
                html += "</tr>";

                html += "</tr>";
            });
            return html
        }

        $('.delete').on('click', function () {
            let rent_id = this.id.split("delete")[1];
            let formData = {
                rent_id: rent_id
            };
            console.log(rent_id);
            $.post("php/modify_data.php?type=delete_rent", formData, function (result) {
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
