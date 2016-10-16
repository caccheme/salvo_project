$(document).ready(function(){

    //see if user can see this page....
    var gamePlayer_Id = getParameterByName('gp');

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

//get shipLocation data for a specific gamePlayer_Id
  $.ajax({
        method: "get",
        url: '/api/game_view/'+ gamePlayer_Id,
        dataType: 'json',
        success: function(data, textStatus, jqXHR) {
                   tableCreate1(data);
                   tableCreate2(data);
                   showPlayerEmail(data);
                console.log(data);

        }
  });//end ajax

     //post the JSON string for a list of ships to controller
      $.post({
              url: "/api/games/players/" + gamePlayer_Id + "/ships",
              dataType: "json",
              contentType: "application/json",
              data: JSON.stringify([{ "shipType": "destroyer", "shipLocations": ["A1", "B1", "C1"] },
                                     { "shipType": "patrol boat", "shipLocations": ["H5", "H6"] }]),
          })
          .done(function (data, status, jqXHR) {
              console.log(data);
          })
          .fail(function (jqXHR, status, httpError) {
              alert("Error: " + status + " " + httpError);
          });

//show player email on page
      function showPlayerEmail(data) {
             $("#player_email").text("Welcome, "+ data.main_player + "!");
      }
//create and fill ship grid, mark where opponent has hit ships
     function tableCreate1(data) {
         var body = document.getElementsByTagName('div')[1];
         var tbl = document.createElement('table');
         tbl.style.width = '35%';
         tbl.setAttribute('border', '1');
         tbl.setAttribute('text-align', 'center');
         tbl.setAttribute('id', 'ship_table');
         var tbdy = document.createElement('tbody');
         for (var i = 0; i < 11; i++) {
             var tr = document.createElement('tr');

             for (var j = 0; j < 11; j++) {
                 if (j==0 && i==0){
                    var td = document.createElement('td')
                        td.appendChild(document.createTextNode(""))
                        tr.appendChild(td)
                 }
                 if (j==0 && i!=0) {
                   // output row header A-J for grid
                   var td = document.createElement('td');
                        td.appendChild(document.createTextNode(i))
                            tr.appendChild(td)

                 }
                 if (i==0 && j!=0) {
                 // output column header 1-10 for grid
                    var td = document.createElement('td');
                        td.appendChild(document.createTextNode(myAlphabetFunction(j)))
                           tr.appendChild(td)
                 }
                 // quit making grid after made 11x11
                 if (i == 11 && j == 11) {
                     break
                 }
                 else if (i > 0 && j > 0) {
                    var td = document.createElement('td');
                    var cellString = myConcatFunction(j,i);

                    //  loop over rest of grid, check for player ships, mark matching locations blue
                    if (checkLocations(getShipLocations(data), cellString) == true) {
                       td.style.backgroundColor = "blue"
                       // check if opponent has hit any ships, mark hit locations red
                       if (td.style.backgroundColor == "blue" && checkLocations(getOpponentSalvoData(data), cellString) == true) {
                         td.style.backgroundColor = "red"
                         td.appendChild(document.createTextNode(getOpponentTurnNumber(data, cellString)));
                       }
                    }

                    tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl)
     }

     function getShipLocations(data) {
           var newArray = [];
           for (var i=0; i < data.main_player_ships.length; i++){
                 for (var j=0; j < data.main_player_ships[i].locations.length; j++){
                    newArray.push(data.main_player_ships[i].locations[j]);
                 }
           }

           return newArray;
     }

     function checkLocations(data, cellString){
         var result = false;
           for (var n = 0; n < data.length; n++) {
              if (data[n] == cellString){
                result = true
              }
           }
           return result;
     }

     // create string values based on table position
     var jArray = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; //so jArray[1] should = "A", etc

     function myConcatFunction(j, i) {
        var str1 = jArray[j];
        var str2 = i.toString();
        var res = str1.concat(str2);
        return res
     }

     function myAlphabetFunction(i) {
        var str = "ABCDEFGHIJKLMNOPQRS";
        var res = str.charAt(i-1);
        return res;
     }

          function getOpponentSalvoData(data) {
            var result = []
              for( var n=0; n < data.gamePlayers.length; n++){
                 if (data.gamePlayers[n].gamePlayer_id != gamePlayer_Id){
                     for (var i = 0; i < data.gamePlayers[n].player_info.salvoes.length; i++) {
                        result.push(data.gamePlayers[n].player_info.salvoes[i].locations);

                     }
                 }
              }
            var myNewArray = [].concat.apply([], result);
            return myNewArray;
          }

          function getOpponentTurnNumber(data, cellString){
              result = "";
              newArray = [];
              for (var i=0; i < data.gamePlayers.length; i++){
                            if (data.gamePlayers[i].gamePlayer_id != gamePlayer_Id){ //get only opponent's salvo locations
                                for (var j = 0; j < data.gamePlayers[i].player_info.salvoes.length ; j++){
                                   for (var k = 0; k < data.gamePlayers[i].player_info.salvoes[j].locations.length; k++){
                                      if (data.gamePlayers[i].player_info.salvoes[j].locations[k] == cellString){
                                         result = data.gamePlayers[i].player_info.salvoes[j].turn
                                      }
                                   }
                                }
                            }

                        }
              return result;
          }

//create and fill salvo grid, marked where gamePlayer has shot at opponent
     function tableCreate2(data) {
         var body = document.getElementsByTagName('div')[2];
         var tbl = document.createElement('table');
         tbl.style.width = '35%';
         tbl.setAttribute('border', '1');
         tbl.setAttribute('text-align', 'center');
         var tbdy = document.createElement('tbody');
         for (var i = 0; i < 11; i++) {
             var tr = document.createElement('tr');

             for (var j = 0; j < 11; j++) {
                 if (j==0 && i==0){
                    var td = document.createElement('td')
                        td.appendChild(document.createTextNode(""))
                        tr.appendChild(td)
                 }
                 if (j==0 && i!=0) {
                   // output row header A-J for grid
                   var td = document.createElement('td');
                        td.appendChild(document.createTextNode(i))
                            tr.appendChild(td)

                 }
                 if (i==0 && j!=0) {
                 // output column header 1-10 for grid
                    var td = document.createElement('td');
                        td.appendChild(document.createTextNode(myAlphabetFunction(j)))
                           tr.appendChild(td)
                 }
                 // quit making grid after made 11x11
                 if (i == 11 && j == 11) {
                     break
                 }
                 else if (i > 0 && j > 0) {
                     var td = document.createElement('td');

                    var cellString = myConcatFunction(j,i);

                    //  loop over rest of grid, check for salvoLocations
                    if (checkLocations(getSalvoData(data), cellString) == true) {
                       td.style.backgroundColor = "orange";
                       td.appendChild(document.createTextNode(getTurnNumber(data, cellString)));
                     }
                    tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl)
     }

     function getSalvoData(data){
          var newArray = [];
                for (var i=0; i < data.gamePlayers.length; i++){
                    if (data.gamePlayers[i].gamePlayer_id == gamePlayer_Id){ //get only one gamePlayer's salvo locations
                        for (var j = 0; j < data.gamePlayers[i].player_info.salvoes.length ; j++){
                           for (var k = 0; k < data.gamePlayers[i].player_info.salvoes[j].locations.length; k++){
                                 newArray.push(data.gamePlayers[i].player_info.salvoes[j].locations[k]);
                           }
                        }
                    }
                }
          return newArray;
     }

     function getTurnNumber(data, cellString){
         result = "";
         newArray = [];
         for (var i=0; i < data.gamePlayers.length; i++){
                       if (data.gamePlayers[i].gamePlayer_id == gamePlayer_Id){ //get only one gamePlayer's salvo locations
                           for (var j = 0; j < data.gamePlayers[i].player_info.salvoes.length ; j++){
                              for (var k = 0; k < data.gamePlayers[i].player_info.salvoes[j].locations.length; k++){
                                 if (data.gamePlayers[i].player_info.salvoes[j].locations[k] == cellString){
                                    result = data.gamePlayers[i].player_info.salvoes[j].turn
                                 }
                              }
                           }
                       }

                   }
         return result;
     }

});