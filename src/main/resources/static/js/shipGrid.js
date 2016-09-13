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
                   shipLocationData = getShipLocations(data);
                   salvoLocationData = getSalvoData(data);
                   tableCreate1(shipLocationData);
                   tableCreate2(data);
                   showPlayerEmail(data); //figure out what goes in here again
                console.log(data);
                console.log(shipLocationData);
                console.log(salvoLocationData);

                console.log(data.players[0].salvoes[0].location[0]);

        }
  });//end ajax


       function getSalvoData(data){
         var newArray = [];
               for (var i=0; i < data.players.length; i++){
                   if (data.players[i].gamePlayer_id == gamePlayer_Id){ //get only one gamePlayer's salvo locations
                       for (var j = 0; j < data.players[i].salvoes.length ; j++){
                          for (var k = 0; k < data.players[i].salvoes[j].locations.length; k++){
                                newArray.push(data.players[i].salvoes[j].locations[k]);
                          }
                       }
                   }
               }
         return newArray;
       }



      function getSalvoLocations(data) {
      //myArray is data
          var newArray = [];
          var innerArray = [];
          for (var i=0; i < data.players.length; i++){
              if (data.players[i].gamePlayer_id == gamePlayer_Id){ //get only one gamePlayer's salvo locations
                  for (var j = 0; j < data.players[i].salvoes.length ; j++){
                     for (var k = 0; k < data.players[i].salvoes[j].locations.length; k++){
                           newArray.push(data.players[i].salvoes[j].turn, data.players[i].salvoes[j].locations[k]);
                     }
                  }
              }

          }
          return newArray;
      }


//// get turn number for each salvo shot at a certain location, to put into grid at that location
//    function getTurnNumber(data, cellString){
//        result = "";
//        newArray = [];
//        for (var i=0; i < data.players.length; i++){
//                      if (data.players[i].gamePlayer_id == gamePlayer_Id){ //get only one gamePlayer's salvo locations
//                          for (var j = 0; j < data.players[i].salvoes.length ; j++){
//                             for (var k = 0; k < data.players[i].salvoes[j].locations.length; k++){
//                                if (data.players[i].salvoes[j].location[k] &&   ///working right here trying to see what is undefined....
//                                      data.players[i].salvoes[j].location[k] == cellString){
//                                   result = data.players[i].salvoes[j].turn
//                                }
//                             }
//                          }
//                      }
//
//                  }
//        return result;
//    }



      function getShipLocations(data) {
      //myArray is data
          var newArray = [];
          for (var i=0; i < data.players.length; i++){
              if (data.players[i].gamePlayer_id == gamePlayer_Id){ //get only one gamePlayer's ship locations
                  for (var j = 0; j < data.players[i].ships.length ; j++){
                     for (var k = 0; k < data.players[i].ships[j].locations.length; k++){
                           newArray.push(data.players[i].ships[j].locations[k]);
                     }
                  }
              }

          }
          return newArray;
      }

      function showPlayerEmail(data) {
        for (var i=0; i < data.players.length; i++){
          if (data.players[i].gamePlayer_id == gamePlayer_Id){
             $("#player_email").text("Welcome, "+ data.players[i].email + "!");
          }
        }
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
                    var cellString = myConcatFunction(j,i);

                    //  loop over rest of grid, check for shipLocations, mark matching locations blue
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

//create salvo grid marked where gamePlayer has shot at opponent
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

                   salvoLocationData = getSalvoData(data);
                    if (checkLocations(salvoLocationData, cellString) == true) {
                       td.style.backgroundColor = "orange";
//                       td.appendChild(document.createTextNode(getTurnNumber(data, cellString))); //need to add this still
                     }
                    tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl)
     }





//
//////mark hits by opponent player on displayed gamePlayer's ship grid in red
////     function getShipHits(data){
////        var table = document.getElementById("ship_table");
////        for (var i = 0, row; row = table.rows[i]; i++) {
////           //iterate through rows
////           //rows would be accessed using the "row" variable assigned in the for loop
////           for (var j = 0, col; col = row.cells[j]; j++) {
////             //iterate through columns
////             //columns would be accessed using the "col" variable assigned in the for loop
////             var cellString = myConcatFunction(j,i);
////             if (row.cells[j].style.backgroundColor == "blue" && checkLocations(flattenArray(getOpponentSalvoData(data)), cellString) == true) {
////                    row.cells[j].style.backgroundColor = "red"
////                    var text = getOpponentTurnNumber(getOpponentSalvoData(data), cellString);
////                    row.cells[j].appendChild(document.createTextNode(text));
////
////             }
////           }
////        }
////    }
//
//       // create string values based on table position
//      var jArray = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
//
//      function myConcatFunction(j, i) {
//          var str1 = jArray[j];
//          var str2 = i.toString();
//          var res = str1.concat(str2);
//          return res
//      }
//
////     function checkLocations(data, cellString){
////        var result = false;
////        for (var n = 0; n < data.length; n++) {
////            if (data[n] == cellString){
////              result = true
////            }
////        }
////        return result;
////     }
//
//
//     function myAlphabetFunction(i) {
//         var str = "ABCDEFGHIJKLMNOPQRS";
//         var res = str.charAt(i-1);
//         return res;
//     }


//
//// get opponent turn number from opponent salvo data and use to mark hits on ship grid
//    function getOpponentTurnNumber(data, cellString) {
//        result = ""
//            for (var i = 0; i < data.length; i++) {
//                for (var j=0; j < data[i].length; j++){
//                   if (data[i][j] == cellString){
//                         result = i+1;
//                   }
//                }
//            }
//        return result;
//    }
//
//      function getGameID(data){
//        var gameID = ""
//        for (var i = 0; i < data.length; i++) {
//            if (data[i].gamePlayer_id == gamePlayer_Id) {
//                gameID = data[i].game_id;
//            }
//        }
//        return gameID;
//      }
//
//      function getOpponentSalvoData(data) {
//        var result = ""
//            for (var i = 0; i < data.length; i++) {
//                if (data[i].game_id == getGameID(data)) {
//                    result = (data[i].salvo_locations);
//                }
//            }
//        return result;
//      }

});