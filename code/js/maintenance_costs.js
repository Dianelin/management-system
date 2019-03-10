$(document).ready(function () {

    $.getJSON("php/get_data.php?type=get_cost&start_time=2015-1-1&end_time=2020-1-1", function (data) {
        console.log(data);
        $("#cost_table").html(get_cost_html(data));
    });

    const season_start={'1':'1-1','2':"4-1",'3':"7-1",'4':'10-1'};
    const season_end={'1':'4-1','2':"7-1",'3':"10-1",'4':'12-31'};
    $("#query_total").on("click", function () {
        let year = $("#selectYear").val();
        let month = $("#selectMonth").val();
        let season = $("#selectSeason").val();
        let query_type =$("input[name='query_type']:checked").val();
        if(query_type==='season'){
            if(year==='%' || season==='%')
                alert("请选择年份和季度");
            else {
                start_time=""+year+"-"+season_start[season];
                end_time=""+year+"-"+season_end[season];
            }
        }else {
            if(year==='%' || month==='%')
                alert("请选择年份和月份");
            else {
                start_time=""+year+"-"+month+"-1";
                if(month==='12'){
                    year = parseInt(year)+1;
                    month = 1;
                }else {
                    month=parseInt(month)+1;
                }
                end_time=""+year+"-"+month+"-1";
            }
        }
        $.getJSON("php/get_data.php?type=get_cost&start_time="+start_time+"&end_time="+end_time, function (data) {
            console.log(data);
            $("#cost_table").html(get_cost_html(data));
        });

    });

});


function get_cost_html(data) {
    let html = "";
    $.each(data, function (index, item) {
        html += "<tr>";
        html += '<td class="center">' + item.plot_name + '</td>';
        html += '<td class="center">' + item.total_cost+'</td>';
        html += "</tr>";
    });
    return html
}
