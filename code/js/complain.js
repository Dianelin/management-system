$(document).ready(function () {

    $.getJSON("php/get_data.php?type=get_check_in_resident", function (resident_data) {

        $("#add_selectResident").html(get_resident_html(resident_data));

    });

    function get_resident_html(resident_data) {
        let html = '<select data-rel="chosen" class="btn-md" id="selectResident' + '">';
        html += '<option value="0">选择住户</option>';
        $.each(resident_data, function (index, item) {
            html += '<option value="' + item.check_in_id + '">' + item.plot_name + '区' + +item.unit_no + '单元' +
                item.building_no + '弄' + item.room_no + '号' + ' ' + item.name + '</option>';
        });
        html += '</select>';
        return html
    }
    const list={'1':'住户','2':'设备','3':'安保','4':'费用','5':'其他'};
    $('#add_complain').on('click', function () {
        let complain_type=$("#add_selectType").val();
        let check_in_id=$("#selectResident").val();
        let description=$("#complain_content").val();
        console.log(list[complain_type]);
        console.log(complain_type);


        if(complain_type==='0'||check_in_id==='0'||description==''){
            alert('请选补全信息');
        }else{
            let formData = {
                complain_type: list[complain_type],
                check_in_id:check_in_id,
                description: description
            };
            console.log(formData);
            $.post("php/add_data.php?type=add_complain", formData, function (result) {
                if (result === '0') {
                    alert("新增投诉失败");
                } else {
                    alert("新增投诉成功");
                    window.location.reload();
                }

            });
        }

    });


    //得到所有的complain条目
    $.getJSON("php/get_data.php?type=get_complain", function (data) {
        console.log(data);
        fill_complain(data)
    });

    //按照入住信息，指定的开始和结束进行查询
    $.getJSON("php/get_data.php?type=get_ruzhu_complain&start_time=2015-1-1&end_time=2020-1-1", function (data) {
        console.log(data);
        $("#complain_checkin_table").html(get_complain_checkin_html(data));
    });

    //按照类型，指定的开始和结束进行查询
    $.getJSON("php/get_data.php?type=get_type_complain&start_time=2019-1-1&end_time=2019-2-1", function (data) {
        console.log(data);
        $("#complain_type_table").html(get_complain_type_html(data));
    });

    //按照指定一年的信息，进行查询
    $.getJSON("php/get_data.php?type=get_year_complain", function (data) {
        console.log(data);
        $("#complain_time_table").html(get_complain_time_html(data));
    });
    const season_start = {'1': '1-1', '2': "4-1", '3': "7-1", '4': '10-1'};
    const season_end = {'1': '4-1', '2': "7-1", '3': "10-1", '4': '12-31'};
    $("#query_total").on("click", function () {
        let year = $("#selectYear").val();
        let month = $("#selectMonth").val();
        let season = $("#selectSeason").val();
        let query_type = $("input[name='query_type']:checked").val();
        if (query_type === 'season') {
            if (year === '%' || season === '%')
                alert("请选择年份和季度");
            else {
                start_time = "" + year + "-" + season_start[season];
                end_time = "" + year + "-" + season_end[season];
            }
        } else {
            if (year === '%' || month === '%')
                alert("请选择年份和月份");
            else {
                start_time = "" + year + "-" + month + "-1";
                if (month === '12') {
                    year = parseInt(year) + 1;
                    month = 1;
                } else {
                    month = parseInt(month) + 1;
                }
                end_time = "" + year + "-" + month + "-1";
            }
        }
        $.getJSON("php/get_data.php?type=get_ruzhu_complain&start_time=" + start_time + "&end_time=" + end_time, function (data) {
            console.log(data);
            $("#complain_checkin_table").html(get_complain_checkin_html(data));
        });

        $.getJSON("php/get_data.php?type=get_type_complain&start_time=" + start_time + "&end_time=" + end_time, function (data) {
            console.log(data);
            $("#complain_type_table").html(get_complain_type_html(data));
        });
    });

});

const process_state = {'0': "未处理", '1': "处理中", '2': "已处理"};
function fill_complain(data) {
    $("#complain_table").html(get_complain_html(data));

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

function get_complain_html(data) {
    let html = "";
    $.each(data, function (index, item) {
        html += "<tr>";
        html += '<td class="center">' + item.complain_id + '</td>';
        html += '<td class="center">' + item.type + '</td>';
        html += '<td class="center">' + item.description + '</td>';
        html += '<td class="center">' + item.plot_name + '</td>';
        html += '<td class="center">' + item.unit_no + '单元-' + item.building_no + '号楼-' + item.room_no + ' ' + item.NAME + '</td>';
        html += '<td class="center">' + item.time.split(" ")[0] + '</td>';
        html += '<td class="center">' + process_state[item.process] + '</td>';
        if (item.result == null)
            item.result = '-';
        html += '<td class="center">' + item.result + '</td>';

        html += "<td class=\"center\">\n" +
            "<button class='btn btn-info edit' id='edit" + item.room_id + "'><i class='glyphicon glyphicon-edit icon-white'></i> 编辑</button>\n" + "</td>";
        html += "</tr>";
    });
    return html
}

function get_complain_checkin_html(data) {
    let html = "";
    $.each(data, function (index, item) {
        html += "<tr>";
        html += '<td class="center">' + item.plot_name + '</td>';
        html += '<td class="center">' + item.unit_no + '</td>';
        html += '<td class="center">' + item.building_no + '</td>';
        html += '<td class="center">' + item.room_no + '</td>';
        html += '<td class="center">' + item.name + '</td>';
        html += '<td class="center">' + item.total_complain + '</td>';
        html += "</tr>";
    });
    return html
}

function get_complain_type_html(data) {
    let html = "";
    $.each(data, function (index, item) {
        html += "<tr>";
        html += '<td class="center">' + item.type + '</td>';
        html += '<td class="center">' + item.total_complain + '</td>';
        html += "</tr>";
    });
    return html
}
function get_complain_time_html(data) {
    let html = "";
    $.each(data, function (index, item) {
        html += "<tr>";
        html += '<td class="center">' + item.year + '</td>';
        html += '<td class="center">' + item.month + '</td>';
        html += '<td class="center">' + item.total_complain + '</td>';
        html += "</tr>";
    });
    return html
}