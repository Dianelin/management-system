$(document).ready(function () {
    let date = new Date();
    let current_year = date.getFullYear();
    let current_month = date.getMonth() +1;
    let current_part = Math.floor((date.getMonth() +1)/6)*6+1;
    $("#selectYear").val(current_year);
    $("#selectYear_out").val(current_year);
    $("#selectMonth").val(current_month);
    $("#select_part").val( current_part);
    $.getJSON("php/get_data.php?type=get_check&base_type=0&year="+current_year+"&month="+current_month, function (data) {
        fill_in_check(data);
        if(data.length>0)
            $("#generate_in").hide();

    });
    $.getJSON("php/get_data.php?type=get_check&base_type=1&year="+current_year+"&month="+current_part, function (data) {
        console.log(data);
        fill_out_check(data);
        console.log(data.length);
        if(data.length>0)
            $("#generate_out").hide();
    });

    $("#generate_in").on('click',function () {
        let year = $("#selectYear").val();
        let month = $("#selectMonth").val();
        $.getJSON("php/get_data.php?type=add_check&base_type=0&year="+year+"&month="+month, function (data) {
            fill_in_check(data);
            if(data.length>0)
                $("#generate_in").hide();

        });
    });
    $("#generate_out").on('click',function () {
        let year = $("#selectYear_out").val();
        let month = $("#select_part").val();
        $.getJSON("php/get_data.php?type=add_check&base_type=1&year="+year+"&month="+month, function (data) {
            fill_out_check(data);
            if(data.length>0)
                $("#generate_out").hide();
            else
                $("#generate_out").show();

        });
    });
    $("#query_in").on('click',function () {
        let year = $("#selectYear").val();
        let month = $("#selectMonth").val();
        $.getJSON("php/get_data.php?type=get_check&base_type=0&year="+year+"&month="+month, function (data) {
            fill_in_check(data);
            if(data.length>0)
                $("#generate_in").hide();
            else
                $("#generate_in").show();

        });
    });
    $("#query_out").on('click',function () {
        let year = $("#selectYear_out").val();
        let month = $("#select_part").val();
        $.getJSON("php/get_data.php?type=get_check&base_type=1&year="+year+"&month="+month, function (data) {
            fill_out_check(data);
            if(data.length>0)
                $("#generate_out").hide();
            else
                $("#generate_out").show();
        });
    });

});

function fill_in_check(data) {
    $("#in_check_table").html(get_in_check_html(data));
}
function fill_out_check(data) {
    $("#out_check_table").html(get_in_check_html(data));
}

function get_in_check_html(data) {
    let html = "";
    $.each(data, function (index, item) {
        if (item.condition==null)
            item.condition="待排查";
        else if (item.condition==='1')
            item.condition="良好";
        else
            item.condition="损坏";
        if (item.staff_name==null)
            item.staff_name="未安排";

        html += "<tr>";
        html += '<td class="center">' + item.basement_id + '</td>';
        html += '<td class="center">' + item.name + '</td>';
        html += '<td class="center">' + item.plot_name + '</td>';
        html += '<td class="center">' + item.unit_no+'单元-'+item.building_no+'号楼'+'</td>';
        html += '<td class="center">' + item.year+'-'+item.month + '</td>';
        let state='-';
        if(item.condition==='0'){
            html += '<td class="center">' + '损坏' + '</td>';
            if(item.repair_id==null){
                let formData=null;
                $.post("php/add_data.php?type=add_repair", formData, function (result) {
                    if (result === '0') {
                        console.log("新增失败");
                    } else {
                        console.log("新增成功");
                    }
                });
            }
            if(item.re_time==null){
                state='待维修'
            }else{
                state='已经维修'
            }
        }else{
            html += '<td class="center">' + item.condition + '</td>';
            state='-';
        }
        html += '<td class="center">' + state + '</td>';

        html += '<td class="center">' + item.staff_name + '</td>';

        // html += "<td class=\"center\">\n" +
        //     "<button class='btn btn-info edit' id='edit" + item.basement_id + "'><i class='glyphicon glyphicon-edit icon-white'></i> 编辑</button>\n" + "</td>";
        // html += "</tr>";
    });
    return html
}
