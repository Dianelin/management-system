$(document).ready(function () {

    $.getJSON("php/get_data.php?type=get_parking_resident_list", function (resident_data) {

        $("#query").on("click", function () {
            let plot_id = $("#selectPlot").val();
            let parking_type = $("#selectType").val();
            let state = $("#selectStatus").val();
            $.getJSON("php/get_data.php?type=get_parking_list&plot_id=" + plot_id + "&parking_type=" + parking_type + "&state="+state, function (data) {
                fill_parking(data)
            });
        });

        $.getJSON("php/get_data.php?type=get_parking_list&plot_id=%&parking_type=%&state=%", function (data) {
            fill_parking(data);
        });

        function fill_parking(data) {
            $("#parking_table").html(get_parking_html(data));


            function get_parking_html(data) {
                let html = "";
                const parking_type = {'0': "临停", '1': '租用', '2': '购买'};

                $.each(data, function (index, item) {
                    html += "<tr>";
                    html += '<td class="center">' + item.parking_id + '</td>';
                    html += '<td class="center">' + parking_type[item.type] + '</td>';
                    html += '<td class="center">' + item.sp_name + '</td>';
                    html += '<td class="center">' + item.plot_name + '</td>';


                    if (item.state === '0' && item.type === '1') {
                        html += '<td class="center">' + get_resident_html(item.parking_id) +
                            get_select_month(item.parking_id) +
                            " <button class=\"btn btn-success rent\" id='rent" + item.parking_id + "'><i class=\"glyphicon glyphicon-home icon-white\"></i> 租用</button>\n" + '</td>';
                    } else if (item.state === '0' && item.type === '2') {
                        html += '<td class="center">' + get_resident_html(item.parking_id) +
                            " <button class=\"btn btn-success buy\" id='buy" + item.parking_id + "'><i class=\"glyphicon glyphicon-home icon-white\"></i>购买</button>\n" + '</td>';
                    } else if (item.state === '0' && item.type === '0') {
                        html += '<td class="center">' + " 闲置  " + '</td>';
                    } else {
                        html += '<td class="center">' + " 已使用 " + '</td>';
                    }

                    html += "<td class=\"center\">\n" +
                        "<button class='btn btn-info edit' id='edit" + item.parking_id + "'><i class='glyphicon glyphicon-edit icon-white'></i> 编辑</button>\n" + "</td>";
                    html += "</tr>";

                    html += "</tr>";
                });
                return html
            }


            function get_resident_html(parking_id) {
                let html = '<select data-rel="chosen" class="btn-md" id="selectResident' + parking_id + '">';
                html += '<option value="0">选择住户</option>';
                $.each(resident_data, function (index, item) {
                    html += '<option value="' + item.check_in_id + '">' + item.check_in_id + ' ' + item.name + ' ' + item.tel + '</option>';
                });
                html += '</select>';
                return html
            }

            function get_select_month(parking_id) {
                let html = '<select data-rel="chosen" class="btn-md" id="selectMonth' + parking_id + '">';
                html += '<option value="0">选择月份</option>';
                // $.each(resident_data, function (index, item) {
                for (let i = 1; i < 13; i++) {
                    html += '<option value="' + i + '">' + i + '</option>';
                }
                // });
                html += '</select>';
                return html
            }


            $('.rent').on('click', function () {
                let parking_id = this.id.split("rent")[1];
                let check_in_id = $("#selectResident" + parking_id + "").val();
                let total_month = $("#selectMonth" + parking_id + "").val();

                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month === 12) {
                    year = year + 1;
                    month = 1;
                } else {
                    month += 1;
                }

                let end_month = month + parseInt(total_month);
                let end_year = year;
                if (end_month > 12) {
                    end_year += 1;
                    end_month = end_month - 12;
                }

                let start_time = year + '-' + month + '-' + '1';
                let end_time = end_year + '-' + end_month + '-' + '1';

                if (check_in_id === '0') {
                    alert("请选择住户或先在住户界面添加住户！")
                } else if (total_month === '0') {
                    alert("请选择需要租用的日期")

                } else {
                    let formData = {
                        parking_id: parking_id,
                        check_in_id: check_in_id,
                        start_time: start_time,
                        end_time: end_time,
                        total_month: total_month
                    };
                    $.post("php/add_data.php?type=add_rent_parking", formData, function (result) {
                        if (result === '0') {
                            alert("租用失败");
                        } else {
                            alert("租用成功,从下月起生效");
                            window.location.reload();
                        }
                    });
                }
            });
            $('.buy').on('click', function () {
                let parking_id = this.id.split("buy")[1];
                let check_in_id = $("#selectResident" + parking_id + "").val();

                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                if (month === 12) {
                    year = year + 1;
                    month = 1;
                } else {
                    month += 1;
                }

                let start_time = year + '-' + month + '-' + '1';

                if (check_in_id === '0') {
                    alert("请选择住户或先在住户界面添加住户！")
                } else {
                    let formData = {
                        parking_id: parking_id,
                        check_in_id: check_in_id,
                        start_time: start_time
                    };
                    $.post("php/add_data.php?type=add_buy_parking", formData, function (result) {
                        if (result === '0') {
                            alert("购买失败");
                        } else {
                            alert("购买成功");
                            window.location.reload();
                        }
                    });
                }
            });
        }
    });

});

