$(document).ready(function () {
    let date = new Date();
    let current_year = date.getFullYear();
    let current_month = date.getMonth() +1;
    let current_part = Math.floor((date.getMonth() +1)/6)*6+1;
    $("#selectYear").val(current_year);
    $("#selectYear_out").val(current_year);
    $("#selectMonth").val(current_month);
    $("#select_part").val( current_part);
    $.getJSON("php/get_data.php?type=get_bill&year="+current_year+"&month="+current_month+"&plot_id=%&unit_no=%&building_no=%&process=%", function (data) {
        fill_bill(data);
        if(data.length>0)
            $("#generate_in").hide();

    });

    $("#generate_in").on('click',function () {
        let year = $("#selectYear").val();
        let month = $("#selectMonth").val();
        $.getJSON("php/get_data.php?type=add_bill&base_type=0&year="+year+"&month="+month+"&plot_id=%&unit_no=%&building_no=%&process=%", function (data) {
            fill_bill(data);
            if(data.length>0)
                $("#generate_in").hide();

        });
    });

    $("#query_in").on('click',function () {
        let year = $("#selectYear").val();
        let month = $("#selectMonth").val();
        $.getJSON("php/get_data.php?type=get_bill&year="+year+"&month="+month+"&plot_id=%&unit_no=%&building_no=%&process=%", function (data) {
            fill_bill(data);
            if(data.length>0)
                $("#generate_in").hide();
            else
                $("#generate_in").show();

        });
    });

    $("#query").on("click", function () {
        let plot_id = $("#selectPlot").val();
        let unit_no = $("#selectUnit").val();
        let building_no = $("#selectBuilding").val();
        let state = $("#selectStatus").val();
        let year = $("#selectYear").val();
        let month = $("#selectMonth").val();
        $.getJSON("php/get_data.php?type=get_bill&year="+year+"&month="+month+"&plot_id=" + plot_id + "&unit_no=" + unit_no + "&building_no=" + building_no + "&process=" + state, function (data) {
            fill_bill(data);
        });
    });

});

function fill_bill(data) {
    $("#bill_table").html(get_bill_html(data));

    $(".edit").on('click', function () {
        let m_id = this.id.split("edit")[1];
        let formData = {
            m_id: m_id
        };
        $.post("php/modify_data.php?type=update_bill_process", formData, function (result) {
            if (result === '0') {
                alert("缴纳失败");
            } else {
                alert("缴纳成功");
                window.location.reload();
            }
        });
    });
}

const process_trans={'0':'待缴纳','1':'已缴纳'};
function get_bill_html(data) {
    let html = "";
    $.each(data, function (index, item) {
        html += "<tr>";
        html += '<td class="center">' + item.plot_name + '</td>';
        html += '<td class="center">' + item.unit_no + '</td>';
        html += '<td class="center">' + item.building_no + '</td>';
        html += '<td class="center">' + item.room_no+'</td>';
        html += '<td class="center">' + item.name+ '</td>';
        html += '<td class="center">' + item.base_income + '</td>';
        html += '<td class="center">' + item.rent_income + '</td>';
        html += '<td class="center">' + item.total_income + '</td>';
        html += '<td class="center">' + process_trans[item.process] + '</td>';

        if(item.process==='0'){
            html += "<td class=\"center\">\n" +
                "<button class='btn btn-info edit' id='edit" + item.m_id + "'><i class='glyphicon glyphicon-edit icon-white'></i> 缴纳</button>\n" + "</td>";
        }else {
            html += "<td class=\"center\"> - </td>";
        }

        html += "</tr>";
    });
    return html
}
