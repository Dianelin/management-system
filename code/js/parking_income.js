$(document).ready(function () {
    $.getJSON("php/get_data.php?type=get_parking_income&plot=A", function (data) {
        $("#parking1_table").html(get_parking_income_html(data));
    });
    $.getJSON("php/get_data.php?type=get_parking_income&plot=B", function (data) {
        $("#parking2_table").html(get_parking_income_html(data));
    });
    $.getJSON("php/get_data.php?type=get_parking_income&plot=C", function (data) {
        $("#parking3_table").html(get_parking_income_html(data));
    });

    function get_parking_income_html(data, plot) {
        let html = "";

        $.each(data, function (index, item) {
            html += "<tr>";
            html += '<td class="center">' + item.YEAR + '</td>';
            html += '<td class="center">' + item.MONTH + '</td>';

            if(item.type==='0'){
                html += '<td class="center">' + '临停' + '</td>';

            }else if(item.type==='1'){
                html += '<td class="center">' + '租用' + '</td>';

            }else{
                html += '<td class="center">' + '购买' + '</td>';
            }
            html += '<td class="center">' + item.income + '</td>';


            html += "</tr>";

        });
        return html
    }
});
