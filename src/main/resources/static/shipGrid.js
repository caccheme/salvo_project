$(document).ready(function(){

    var gamePlayer_Id = getParameterByName('gp');

//get shipLocation data for a specific gamePlayer_Id
  $.ajax({
        method: "get",
        url: '/api/gpShipLocations/'+ gamePlayer_Id,
        dataType: 'json',
        success: function(shipData, textStatus, jqXHR) {
                   shipData = flattenArray(shipData.shipLocations);
                   tableCreate1(shipData);

        }
  });//end ajax


  //get salvoLocation data tied to gamePlayers and games
    $.ajax({
          method: "get",
          url: '/api/salvoes',
          dataType: 'json',
          success: function(salvo, textStatus, jqXHR) {
                     tableCreate2(salvo);
                     getShipHits(salvo);
          }
    });//end ajax


    function flattenArray(myArray) {
        var myNewArray = [].concat.apply([], myArray);
        return myNewArray;
    }

// get gamePlayer data
    $.ajax({
            method: "get",
            url: '/api/gamePlayers/',
            dataType: 'json',
            success: function(gamePlayers, textStatus, jqXHR) {
                getPlayerEmail(gamePlayers);
            }
    });//end ajax

// gamePlayer id is the position in the gamePlayers data array, so gamePlayer id = 1 is gamePlayers[0] object
// get gamePlayer email from gamePlayers object
    function getPlayerEmail(gamePlayers) {
        var result = ""
            if (gamePlayers[gamePlayer_Id-1].player.id) {
                result = gamePlayers[gamePlayer_Id-1].player.email;
            }
        emailShow("Welcome, "+ result + "!");
    }

// show email/name of player on web view
    function emailShow(string) {
        $("#player_email").text(string);
    }

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
                     //loop through game data and fill in grid where ships are ... still to do
                     //the param obj search should give the gp id value and can use it in this loop


                    // create string values based on table position
                    var jArray = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; //so jArray[1] should = "A", etc

                    function myConcatFunction(j, i) {
                        var str1 = jArray[j];
                        var str2 = i.toString();
                        var res = str1.concat(str2);
                        return res
                    }

                    var cellString = myConcatFunction(j,i);

                    //  loop over rest of grid, check for shipLocations, mark matching locations blue
//                    td.appendChild(document.createTextNode(cellString)); // mark cells so can visually check ship locations
                    if (checkLocations(data, cellString) == true) {
                       td.style.backgroundColor = "blue"
                    }

                    tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl)
     }

//mark hits by opponent player on displayed gamePlayer's ship grid in red
     function getShipHits(data){
        var table = document.getElementById("ship_table");
        for (var i = 0, row; row = table.rows[i]; i++) {
           //iterate through rows
           //rows would be accessed using the "row" variable assigned in the for loop
           for (var j = 0, col; col = row.cells[j]; j++) {
             //iterate through columns
             //columns would be accessed using the "col" variable assigned in the for loop
             var cellString = myConcatFunction(j,i);
             if (row.cells[j].style.backgroundColor == "blue" && checkLocations(getOpponentSalvoData(data), cellString) == true) {
                    row.cells[j].style.backgroundColor = "red"
             }
           }
        }
    }

       // create string values based on table position
      var jArray = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

      function myConcatFunction(j, i) {
          var str1 = jArray[j];
          var str2 = i.toString();
          var res = str1.concat(str2);
          return res
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


     function myAlphabetFunction(i) {
         var str = "ABCDEFGHIJKLMNOPQRS";
         var res = str.charAt(i-1);
         return res;
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

//create salvo grid marked where gamePlayer has shot at opponent
     function tableCreate2(salvo) {
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
                     //loop through game data and fill in grid where ships are ... still to do
                     //the param obj search should give the gp id value and can use it in this loop


                    // create string values based on table position
                    var jArray = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; //so jArray[1] should = "A", etc

                    function myConcatFunction(j, i) {
                        var str1 = jArray[j];
                        var str2 = i.toString();
                        var res = str1.concat(str2);
                        return res
                    }

                    var cellString = myConcatFunction(j,i);

                    //  loop over rest of grid, check for salvoLocations
                    if (checkLocations(getGamePlayerSalvoData(salvo), cellString) == true) {
                       td.style.backgroundColor = "orange"
                     }
                    tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl)
     }

      function getGamePlayerSalvoData(data){
        var result = ""
        for (var i = 0; i < data.length; i++) {
           if (data[i].gamePlayer_id == gamePlayer_Id) {
                result = flattenArray(data[i].salvo_locations);
           }
        }
        return result;
      }

      function getGameID(data){
        var gameID = ""
        for (var i = 0; i < data.length; i++) {
            if (data[i].gamePlayer_id == gamePlayer_Id) {
                gameID = data[i].game_id;
            }
        }
        return gameID;
      }

      function getOpponentSalvoData(data) {
        var result = ""
            for (var i = 0; i < data.length; i++) {
                if (data[i].game_id == getGameID(data)) {
                    result = flattenArray(data[i].salvo_locations);
                }
            }
        return result;
      }

});