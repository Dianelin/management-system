$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_plot_list", function (data) {
        $("#select_plot").html(get_plot_html(data));
    });

    $.getJSON("php/get_data.php?type=get_resident_list", function (resident_data) {
        $.getJSON("php/get_data.php?type=get_room_list&plot_id=%&unit_no=%&building_no=%&room_state=%", function (data) {
            fill_room(data);
        });

        $("#add_room").on("click", function () {
            let formData = {
                plot_id: $("#add_selectPlot").val(),
                unit_no: $("#unit_no").val(),
                building_no: $("#building_no").val(),
                room_no: $("#room_no").val(),
                area: $("#area").val(),
            };
            $.post("php/add_data.php?type=add_room", formData, function (result) {
                if (result === '0') {
                    alert("添加失败");
                } else {
                    alert("添加/编辑成功");
                }

            });
        });
        $("#query").on("click", function () {
            let plot_id = $("#selectPlot").val();
            let unit_no = $("#selectUnit").val();
            let building_no = $("#selectBuilding").val();
            let room_state = $("#selectStatus").val();
            $.getJSON("php/get_data.php?type=get_room_list&plot_id=" + plot_id + "&unit_no=" + unit_no + "&building_no=" + building_no + "&room_state=" + room_state, function (data) {
                fill_room(data);
            });
        });

        function fill_room(data) {
            $("#room_table").html(get_room_html(data));

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

            $('.check_in').on('click', function () {
                console.log("check_in");
                let room_id = this.id.split("check_in")[1];
                resident_id = $("#selectResident"+room_id+"").val();
                console.log(resident_id);
                if(resident_id==='0'){
                    alert("请选择住户或先在住户界面添加住户！")
                }else{
                    let formData = {
                        room_id: room_id,
                        resident_id:resident_id,
                    };
                    $.post("php/add_data.php?type=add_check_in", formData, function (result) {
                        if (result === '0') {
                            alert("添加入住信息失败");
                        } else {
                            alert("添加入住信息成功");
                            window.location.reload();
                        }
                    });
                }


            });

        }

        function get_room_html(data) {
            let html = "";
            $.each(data, function (index, item) {
                html += "<tr>";
                html += '<td class="center">' + item.plot_name + '</td>';
                html += '<td class="center">' + item.unit_no + '</td>';
                html += '<td class="center">' + item.building_no + '</td>';
                html += '<td class="center">' + item.room_no + '</td>';
                html += '<td class="center">' + item.area + '</td>';
                if (item.room_state === '0') {
                    html += '<td class="center">' + get_resident_html(item.room_id)+
                        " <button class=\"btn btn-success check_in\" id='check_in" + item.room_id + "'><i class=\"glyphicon glyphicon-home icon-white\"></i> 入住</button>\n" + '</td>';
                } else {
                    html += '<td class="center">' + " 已入住  " + '</td>';
                }
                html += "<td class=\"center\">\n" +
                    "<button class='btn btn-info edit' id='edit" + item.room_id + "'><i class='glyphicon glyphicon-edit icon-white'></i> 编辑</button>\n" + "</td>";
                html += "</tr>";
            });
            return html
        }


        function get_resident_html(room_id) {
            var html = '<select data-rel="chosen" class="btn-md" id="selectResident' + room_id + '">';
            html += '<option value="0">选择住户</option>';
            $.each(resident_data, function (index, item) {
                html += '<option value="' + item.resident_id + '">' + item.name +' '+item.tel+ '</option>';
            });
            html += '</select>';
            return html
        }
    });

    function get_plot_html(data) {
        var html = " <option>所有小区</option>";
        $.each(data, function (index, item) {
            html += '<option>' + item.plot_name + '</option>';
        });
        return html
    }

});