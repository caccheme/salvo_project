$(document).ready(function(){

//This is for shipGrid placing ships logic tied to game.html?gp=nn

    var gamePlayer_Id = getParameterByName('gp');

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

        var cannedData = [ { "type": "destroyer", "locations": ["A1", "B1", "C1"] },
                  { "type": "patrol boat", "locations": ["H5", "H6"] } ]

//this whole thing is going to go into shipGrid.js eventually...was in ship.js to test but will be removed once get shipGrid.js logic working
    //post the JSON string for a list of ships to controller
//    $.post({
//            url: "/api/games/players/" + gamePlayer_Id + "/ships",
//            dataType: "json",
//            contentType: "application/json",
//            data: JSON.stringify([{ "shipType": "destroyer", "shipLocations": ["A1", "B1", "C1"] },
//                                   { "shipType": "patrol boat", "shipLocations": ["H5", "H6"] }]),
//        })
//        .done(function (data, status, jqXHR) {
//            console.log(data);
//        })
//        .fail(function (jqXHR, status, httpError) {
//            alert("Error: " + status + " " + httpError);
//        });

});