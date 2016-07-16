$(document).ready(function(){

//create an 11x11 grid with headers 1-10 and row headers A-J:
    var gamePlayer_Id = getParameterByName('gp');
//    console.log(gamePlayer_Id);

//get shipLocation data for a specific gamePlayer_Id
  $.ajax({
        method: "get",
        url: '/api/gpShipLocations/'+ gamePlayer_Id,
        dataType: 'json',
        success: function(shipData, textStatus, jqXHR) {
                   // since we are using jQuery, you don't need to parse response
                   shipData = flattenArray(shipData.shipLocations);
//                   console.log(shipData);
                   tableCreate1(shipData);

        }
  });//end ajax

//get salvoLocation data for a specific gamePlayer_Id
  $.ajax({
        method: "get",
        url: '/api/gpSalvoLocations/'+ gamePlayer_Id,
        dataType: 'json',
        success: function(salvoData, textStatus, jqXHR) {
                   salvoData = flattenArray(salvoData.salvoLocations);
                   tableCreate2(salvoData);

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

     function tableCreate1(shipData, salvoData) {
         var body = document.getElementsByTagName('div')[1];
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

                    //  loop over rest of grid, check for shipLocations, mark matching locations blue
//                    td.appendChild(document.createTextNode(cellString)); // mark cells so can visually check ship locations
                    if (checkLocations(shipData, cellString) == true) {
                       td.style.backgroundColor = "blue"
                    }
                    //still to do......should have code here, or somewhere similar, to pass salvoData for gamePlayer 2 (Chloe)
                    //so that gamePlayer 1 (Jack) can see where she has hit his ships on his ship grid

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
     function tableCreate2(salvoData) {
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

                    //  loop over rest of grid, check for shipLocations, mark matching locations blue
//                    td.appendChild(document.createTextNode(cellString)); // mark cells so can visually check ship locations
                    if (checkLocations(salvoData, cellString) == true) {
                       td.style.backgroundColor = "orange"
                      // td.appendChild(document.createTextNode(get turn number for the salvo))// to do...get turn number in the salvo cells
                    }

                    tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl)
     }


});