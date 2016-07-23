$(document).ready(function(){

    var gamePlayer_Id = getParameterByName('gp');

//get scores data for a specific gamePlayer_Id
  $.ajax({
        method: "get",
        url: '/api/gpScores/'+ gamePlayer_Id,
        dataType: 'json',
        success: function(scoreData, textStatus, jqXHR) {
                   tableCreate(scoreData);

        }
  });//end ajax

//table for one gamePlayer only
    function tableCreate(scoreData) {
             var body = document.getElementsByTagName('div')[0];
             var tbl = document.createElement('table');
//             tbl.style.width = '35%';
             tbl.setAttribute('border', '1');
             tbl.setAttribute('text-align', 'center');
             var tbdy = document.createElement('tbody');
             for (var i = 0; i < 2; i++) {
                 var tr = document.createElement('tr');
                 for (var j = 0; j < 5; j++) {
                     if (j==0 && i>0){
                        var td = document.createElement('td')
                            td.appendChild(document.createTextNode(scoreData.player))
                            tr.appendChild(td)
                     }
                     if (j==0 && i==0){
                        var td = document.createElement('td')
                            td.appendChild(document.createTextNode("Name"))
                            tr.appendChild(td)
                     }
                     if (i==0 && j==1) {
                     // output headers for grid
                        var td = document.createElement('td');
                            td.appendChild(document.createTextNode("Total"))
                               tr.appendChild(td)
                     }
                     if (i==0 && j==2) {
                     // output headers for grid
                        var td = document.createElement('td');
                            td.appendChild(document.createTextNode("Won"))
                               tr.appendChild(td)
                     }
                     if (i==0 && j==3) {
                     // output headers for grid
                        var td = document.createElement('td');
                            td.appendChild(document.createTextNode("Lost"))
                               tr.appendChild(td)
                     }
                     if (i==0 && j==4) {
                     // output headers for grid
                        var td = document.createElement('td');
                            td.appendChild(document.createTextNode("Tied"))
                               tr.appendChild(td)
                     }
                     if (i == 1 && j ==1){
                     //total
                         var td = document.createElement('td');
                             td.appendChild(document.createTextNode(scoreData.scores.length));
                             tr.appendChild(td)
                     }
                     if (i == 1 && j ==2){
                     //won
                        var td = document.createElement('td');
                            td.appendChild(document.createTextNode(countScoreType(scoreData.scores, 1)));
                            tr.appendChild(td)
                     }

                     if (i == 1 && j ==3){
                     //lost
                         var td = document.createElement('td');
                             td.appendChild(document.createTextNode(countScoreType(scoreData.scores, 0)));
                             tr.appendChild(td)
                     }

                     if (i == 1 && j ==4){
                     //tied
                         var td = document.createElement('td');
                             td.appendChild(document.createTextNode(countScoreType(scoreData.scores, 0.5)));
                             tr.appendChild(td)
                     }
                 }
                 tbdy.appendChild(tr);
             }
             tbl.appendChild(tbdy);
             body.appendChild(tbl)
         }

    //from SO example: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function countScoreType(data, number) {
        var count = 0;
        for(var i = 0; i < data.length; ++i){
            if(data[i] == number)
                count++;
        }
        return count;
    }
});