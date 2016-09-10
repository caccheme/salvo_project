$(document).ready(function(){

//see if user can see this page....
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
            url: '/api/gamePlayer/'+ gamePlayer_Id,
            dataType: 'json',
            success: function(gamePlayer, textStatus, jqXHR) {
                showPlayerEmail(gamePlayer);
            }
    });//end ajax

    function showPlayerEmail(gamePlayer) {
        $("#player_email").text("Welcome, "+ gamePlayer.gamePlayer_name + "!");
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
             if (row.cells[j].style.backgroundColor == "blue" && checkLocations(flattenArray(getOpponentSalvoData(data)), cellString) == true) {
                    row.cells[j].style.backgroundColor = "red"
                    var text = getOpponentTurnNumber(getOpponentSalvoData(data), cellString);
                    row.cells[j].appendChild(document.createTextNode(text));

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
                       td.style.backgroundColor = "orange";
                       td.appendChild(document.createTextNode(getTurnNumber(salvo, cellString)));
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
//        salvoData = data[0][0].salvoLocations[i].salvoLocationCell;
//        salvoData = [];
//
////                          console.log(salvo[0][0].salvoLocations[0].salvoLocationCell);
////                          console.log(salvo[0][0]);
        var result = ""
        for (var i = 0; i < data.length; i++) {
           if (data[i].gamePlayer_id == gamePlayer_Id) {
                result = flattenArray(data[i].salvo_locations);
           }
        }
        return result;
      }

// get turn number for each salvo shot at a certain location, to put into grid at that location
    function getTurnNumber(data, cellString){
        result = ""
        for (var i = 0; i < data.length; i++) {
            for (var j=0; j < data[i].salvo_locations.length; j++){
                for (var k=0; k < data[i].salvo_locations[j].length; k++){
                    if (data[i].salvo_locations[j][k] == cellString){
                        result = j+1
                    }
                }
            }
        }
        return result;
    }

// get opponent turn number from opponent salvo data and use to mark hits on ship grid
    function getOpponentTurnNumber(data, cellString) {
        result = ""
            for (var i = 0; i < data.length; i++) {
                for (var j=0; j < data[i].length; j++){
                   if (data[i][j] == cellString){
                         result = i+1;
                   }
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
                    result = (data[i].salvo_locations);
                }
            }
        return result;
      }

});