$(document).ready(function(){
    $("#salvo_header").hide();

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
                   shipGridCreate(data);
                   showPlayerEmail(data);
                   //only show salvo grid after ships placed
                   if (data.main_player_ships.length != 0){
                       listPlacedShips(data);
                       hideShipPlacementInstructions();
                       salvoGridCreate(data);
                       var thisTurnNumber = getCurrentTurnNumber(data);
                       showTurnNumber(thisTurnNumber);
                    }
                console.log(data);
        }
  });//end ajax

  //test post to put canned data salvos in ....
//      $.post({
//              url: "/api/games/players/" + gamePlayer_Id + "/salvos",
//              dataType: "json",
//              contentType: "application/json",
//              data: JSON.stringify([{ "turn": "10", "salvoLocations": ["J1", "J8", "J10"] }]),
//          })
//          .done(function (data, status, jqXHR) {
//              console.log(data);
//              alert("salvo created:" + data.salvoLocations);
//          })
//          .fail(function (jqXHR, status, httpError) {
//              alert("Error: " + status + " " + httpError);
//          });


//show player email on page
      function showPlayerEmail(data) {
             $("#player_email").text("Welcome, "+ data.main_player + "!");
      }

      function showSalvoHeader() {
            $("#salvo_header").show();
      }

      function showTurnNumber(thisTurnNumber) {
            $("#turn").text("This is Turn Number: " + thisTurnNumber);
      }

      function hideShipPlacementInstructions() {
            $("#instructions").hide();
            $("#total_ships").hide();
      }

//create and fill ship grid, mark where opponent has hit ships
     function shipGridCreate(data) {
         var body = document.getElementById('ship_grid');
         var tbl = document.createElement('table');
//         tbl.style.width = '35%';
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

                    //  loop over rest of grid, check for player ships, mark locations
                        if (checkLocations(getShipLocations(data), cellString) == true) {
                            if (data.main_player_ships != null){
                                td.style.backgroundColor = "blue"
                               // check if opponent has hit any ships, mark hit locations red
                               if (data.gamePlayers){
                                    if (td.style.backgroundColor == "blue" && checkLocations(getOpponentSalvoData(data), cellString) == true) {
                                        td.style.backgroundColor = "red"
                                        td.appendChild(document.createTextNode(getOpponentTurnNumber(data, cellString)));
                                   }
                               }
                            }
                            else {
                                //if ship is being placed it will be grey until it is in the server data
                                td.style.backgroundColor = "grey"
                            }
                        }
                    tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl);
         if (finalArray.length <= 5){
            if (data.main_player_ships){
                if (data.main_player_ships.length == 5){
                    //not clickable...can't add ships
                }
                if (data.main_player_ships.length == 0){
                    clickToAddShipsToTable();
                }
            }
            else{
                clickToAddShipsToTable();
            }
         }
     }

     var finalArray = [];
     function clickToAddShipsToTable() {
        var tempArray = [];
        var cellArray = [];
        var cellLettersArray=[];
        var rowArray = [];
        var table = document.getElementById("ship_table");
        var cells = table.getElementsByTagName("td");

        for(var i = 1; i < cells.length; i++){
           // Cell Object
            var cell = cells[i];
            // Track with onclick
            cell.onclick = function(){
                incrementCount();
                var alphaArray = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; //so jArray[1] should = "A", etc
                var cellIndex = this.cellIndex;
                var cellLetter  = alphaArray[cellIndex];
                var rowIndex = this.parentNode.rowIndex;
                var newLocation = cellLetter + rowIndex;

                if (finalArray.length == 0){ //first ship won't overlap any other ships so just push to arrays
                    cellArray.push(cellIndex);
                    cellLettersArray.push(cellLetter);
                    rowArray.push(rowIndex);
                }
                else {//all the rest of ships have to be checked for overlap of click position
                    if (locationAlreadyUsed(newLocation, finalArray) == true){
                        alert("This location is already being used by another ship.");
                        resetArraysAndCounts();
                        redrawShipTable(finalArray);
                        updateShipList(finalArray);
                    }
                    else {
                        cellArray.push(cellIndex);
                        cellLettersArray.push(cellLetter);
                        rowArray.push(rowIndex);
                    }
                }//end first and second click location overlap check

                if (cellLettersArray.length == 2){
                    //get  all ship selection locations into the tempArray
                    if (cellLettersArray[0] != cellLettersArray[1]){//then it is horizontal
                    //find the cellIndexes between, create new locations with same rowIndex, add to tempArray
                        if (cellArray[0]<cellArray[1]){
                            var lowEnd = cellArray[0];
                            var highEnd = cellArray[1];
                        }
                        if (cellArray[0]>cellArray[1]){
                            var lowEnd = cellArray[1];
                            var highEnd = cellArray[0];
                        }
                        for (var i = lowEnd; i <= highEnd; i++) {
                            newLocation = alphaArray[i]+rowIndex;
                            tempArray.push(newLocation)
                        }
                    }
                    if (cellLettersArray[0] == cellLettersArray[1]){ //then it is vertical
                        //find the rowIndexes between, create new locations with same cellLetter, add to tempArray
                        cellLetter = alphaArray[cellIndex];
                        if (rowArray[0]<rowArray[1]){
                            var lowEnd = rowArray[0];
                            var highEnd = rowArray[1];
                        }
                        if (rowArray[0]>rowArray[1]){
                            var lowEnd = rowArray[1];
                            var highEnd = rowArray[0];
                        }
                        for (var i = lowEnd; i <= highEnd; i++) {
                            newLocation = cellLetter+i;
                            tempArray.push(newLocation);
                        }
                    }//end of get all ship locations into tempArray

                    if (middleLocationAlreadyUsed(tempArray, finalArray) == true){//check that no overlap
                        alert("This location is already being used by another ship.");
                        resetArraysAndCounts();
                        redrawShipTable(finalArray);
                        updateShipList(finalArray);
                    }
                    else{//continue to check diagonal and shipType/length
                        var cellDiff = calculateDifference(cellArray[0], cellArray[1]); //should be two in here as well
                        var rowDiff = calculateDifference(rowArray[0], rowArray[1]); //ditto

                        if (isDiagonal(cellDiff, rowDiff) == false){//check if diagonal
                            var shipLength = cellDiff + rowDiff;
                            var shipType = findShipType(shipLength);
                            if (shipType != false){ //check if length available and correct
                                finalArray.push({"shipType": shipType, "shipLocations": tempArray});
                                redrawShipTable(finalArray);
                                updateShipList(finalArray);
                                if (submitButtonNeeded(finalArray) == true){
                                    addSubmitButton(finalArray);
                                }
                            }
                            else {
                                redrawShipTable(finalArray);
                                updateShipList(finalArray);
                                resetArraysAndCounts();
                            }
                            console.log("shipLength is: " + shipLength)
                            console.log(finalArray);
                            resetArraysAndCounts();
                        }
                        else{
                            alert("This is a diagonal placement. Please choose either a vertical or horizontal ship placement on the grid.");
                            resetArraysAndCounts();
                            redrawShipTable(finalArray);
                            updateShipList(finalArray);
                        } //end diagonal/length/type logic checks...!!!need to add overlap check again within this!!!
                    }//end of overlap logic check
                } //end limit of 2 clicks
            } //end onClick function
        } //end cell length loop
     } //end clickable table

    var currentTurn = "";
    function getCurrentTurnNumber(data){
        var turns = [];
         if (data.gamePlayers){
            for (var i=0; i < data.gamePlayers.length; i++){
                if (data.gamePlayers[i].gamePlayer_id == gamePlayer_Id){ //get only one gamePlayer's salvo locations
                    for (var j = 0; j < data.gamePlayers[i].player_info.salvoes.length ; j++){
                       for (var k = 0; k < data.gamePlayers[i].player_info.salvoes[j].locations.length; k++){
                          turns.push(data.gamePlayers[i].player_info.salvoes[j].turn);
                       }
                    }
                }
            }
         }
         else{
            for (var i=0; i < data.length; i++){
                turns.push(data[i].turn);
            }
         }

         currentTurn = arrayMax(turns)+1;
         return currentTurn;
         console.log(turnNumber);
    }

    function arrayMax(arr) {
      return arr.reduce(function (p, v) {
        return ( p > v ? p : v );
      });
    }


     var tempArray = [];
     function clickToFireSalvos() {

        var table = document.getElementById("salvo_table");
        var cells = table.getElementsByTagName("td");

        for(var i = 1; i < cells.length; i++){
           // Cell Object
            var cell = cells[i];
            // Track with onclick
            cell.onclick = function(){
                incrementCount();
                var alphaArray = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; //so jArray[1] should = "A", etc
                var cellIndex = this.cellIndex;
                var cellLetter  = alphaArray[cellIndex];
                var rowIndex = this.parentNode.rowIndex;
                var newLocation = cellLetter + rowIndex;

                var text = document.getElementById("turn").innerHTML;
                var turnNumber = parseInt(text.replace(/[^0-9\.]/g, ''), 10);

                tempArray.push(newLocation);
                redrawSalvoTable(tempArray);
                console.log(tempArray);
                console.log(tempArray.length);
                if (count == 5){
                    finalArray.push({"turn": turnNumber, "salvoLocations": tempArray});
                    redrawSalvoTable(finalArray);
                    addSubmitSalvoButton(finalArray);
                    count = 0;
                }
                console.log(finalArray);

//                } //end limit of 5 clicks
            } //end onClick function
        } //end cell length loop
     } //end clickable table


     function resetArraysAndCounts(){
        count = 0;
        cellArray = [];
        rowArray = [];
        cellLettersArray = [];
        tempArray = [];
     }

    function submitButtonNeeded(finalArray) {
        result = false;
        if (finalArray.length == 5){
            result = true;
        }
        return result;
    }

     function redrawShipTable(finalArray){
        //redraw table to show where ships are being temporarily placed with each new selection
        var shipTable = document.getElementById("ship_table");
        if (shipTable) {shipTable.parentNode.removeChild(shipTable);}
        shipGridCreate(finalArray); //redraw grid each time ship added
     }

     function redrawSalvoTable(finalArray){
        //redraw table to show where salvos are being temporarily placed with each new selection
        var salvoTable = document.getElementById("salvo_table");
        if (salvoTable) {salvoTable.parentNode.removeChild(salvoTable);}
        salvoGridCreate(finalArray); //redraw grid each time salvo added
     }

     function updateShipList(finalArray) {
        var shipList = document.getElementById("ship_list");
        if (shipList) {shipList.parentNode.removeChild(shipList);}
        shipListCreate(finalArray);
     }

     function locationAlreadyUsed(newLocation, finalArray){
          result = false;
          //check to see if a click is the same as previous ship location or click
          for (var i=0; i < finalArray.length; i++){
             for (var j=0; j < finalArray[i].shipLocations.length; j++){
                 if (newLocation == finalArray[i].shipLocations[j]){
                     console.log(finalArray[i].shipLocations[j] + " is the same as the click: " + newLocation);
                     result = true;
               }
           }
        }
        return result;
     }

    function middleLocationAlreadyUsed(tempArray, finalArray){
        result = false;
        //check to see if a click is the same as previous ship location or click
        for (var a=0; a< tempArray.length; a++){
            for (var i=0; i < finalArray.length; i++){
                for (var j=0; j < finalArray[i].shipLocations.length; j++){
                    if (tempArray[a] == finalArray[i].shipLocations[j]){
                        console.log(finalArray[i].shipLocations[j] + " is the same as the click: " + tempArray[a]);
                        result = true;
                    }
                }
            }
        }
        return result;
    }


      function addSubmitButton(finalArray){
          var body = document.getElementById('submit');
          var button = document.createElement('button');
          button.setAttribute('id', 'ships_button');
          button.innerHTML = 'Submit Ship Placement';
          var json = JSON.stringify(finalArray);
          button.onclick = function(){
             $.post({
                url: "/api/games/players/" + gamePlayer_Id + "/ships",
                dataType: "text",
                contentType: "application/json",
                data: json
            })
            .done(function (data, status, jqXHR) {
//                alert( "Ships Placed");
                window.location.reload();
                console.log(data);
            })
            .fail(function (jqXHR, status, httpError) {
                alert("Error: " + status + " " + httpError);
            });
            return false;
          };
          body.appendChild(button);
      }

      function addSubmitSalvoButton(finalArray){
          var body = document.getElementById('salvo_submit');
          var button = document.createElement('button');
          button.setAttribute('id', 'salvos_button');
          button.innerHTML = 'Submit Salvo Placement';
          var json = JSON.stringify(finalArray);
          button.onclick = function(){
             $.post({
                url: "/api/games/players/" + gamePlayer_Id + "/salvos",
                dataType: "text",
                contentType: "application/json",
                data: json
            })
            .done(function (data, status, jqXHR) {
//                alert( "Ships Placed");
                window.location.reload();
                console.log(data);
            })
            .fail(function (jqXHR, status, httpError) {
                alert("Error: " + status + " " + httpError);
            });
            return false;
          };
          body.appendChild(button);
      }




      //list of ships placed displayed in html as they are placed
      function shipListCreate(finalArray){
          var body = document.getElementById('list');
          var str = '<ul id="ship_list">';
          str += 'Ships Placed:'
          for(var i=0; i<finalArray.length; i++){
             str += '<li id="' + i + '"><label> '+finalArray[i].shipType+'  at locations: ';
             str += finalArray[i].shipLocations+' </label> ';
             str += '<button>Delete</button></li>'; //add button on each ship
          }
          str += '</ul>';
          $(body).append(str);

            $("ul").on("click", "button", function(e) {
                e.preventDefault();
                //remove submit button from screen if deleting a ship placement and have five ships up
                if (finalArray.length == 5){
                    var elem = document.getElementById('ships_button');
                    elem.parentNode.removeChild(elem);

                }
                //remove ship data from finalArray
                removeShipFromFinalArray($(this).parent());
                //remove ship data from list
                $(this).parent().remove();

                return false;

            });

      }

      //list of ships placed displayed in html for game
      function listPlacedShips(data){
          var body = document.getElementById('list');
          var str = '<ul id="ship_list">';
          str += 'Ships Placed:'
          for(var i=0; i< data.main_player_ships.length; i++){
             str += '<li id="' + i + '"><label> '+data.main_player_ships[i].type+'  at: ';
             str += data.main_player_ships[i].locations+' </label> ';
          }
          str += '</ul>';
          $(body).append(str);
      }

    function removeShipFromFinalArray(data){
        //remove the matching data from finalArray
        finalArray.splice(data[0].id, 1); //data[0].id = li element id and matching index in finalArray that was clicked
        var shipTable = document.getElementById("ship_table");
        if (shipTable) {shipTable.parentNode.removeChild(shipTable);}
        shipGridCreate(finalArray);
    }


    //this function checks for multiples, and also if size valid before sending shipType to final array,
    //if not valid size or is a duplicate of a ship already placed, the new ship is not put in array
     function findShipType(shipLength){
        if (finalArray.length == 0){
            if (shipLength == 2){
                return "patrol boat";
            }
            if (shipLength == 3) {
                return "destroyer";
            }
            if (shipLength == 4) {
                return "battleship";
            }
            if (shipLength == 5) {
                return "carrier";
            }
            if (shipLength > 5) {
                alert("Invalid ship size.")
                return false;
            }
        }
        else{
            var numPatrolBoats = finalArray.reduce(function(n, ship) { //DRY up these num... variables
                return n + (ship.shipType == 'patrol boat');
            }, 0);

            var numDestroyers = finalArray.reduce(function(n, ship) {
                return n + (ship.shipType == 'destroyer');
            }, 0);

            var numSubmarines = finalArray.reduce(function(n, ship) {
                return n + (ship.shipType == 'submarine');
            }, 0);

            var numBattleships = finalArray.reduce(function(n, ship) {
                return n + (ship.shipType == 'battleship');
            }, 0);

            var numCarriers = finalArray.reduce(function(n, ship) {
                return n + (ship.shipType == 'carrier');
            }, 0);

                if (shipLength == 2){
                    if (numPatrolBoats == 0){
                       return "patrol boat";
                    }
                    else{
                       alert("Invalid ship size. You have already placed your patrol boat.");
                       return false;
                    }
                }
                if (shipLength == 3){
                    if (numDestroyers == 0){
                        return "destroyer";
                    }
                    if (numDestroyers == 1 && numSubmarines === 0){
                        return "submarine";
                    }
                    if (numDestroyers == 1 && numSubmarines == 1){
                        alert("Invalid ship size.  You have already placed both ships of this size");
                        return false;
                    }
                }
                if (shipLength == 4){
                    if (numBattleships == 0){
                       return "battleship";
                    }
                    else{
                       alert("Invalid ship size. You have already placed your battleship.");
                       return false;
                    }
                }
                if (shipLength == 5){
                    if (numCarriers == 0){
                       return "carrier";
                    }
                    else{
                       alert("Invalid ship size. You have already placed your carrier.");
                       return false;
                    }
                }
                if (shipLength > 5 || shipLength <= 1 ) {
                    alert("Invalid ship size.")
                    return false;
                }
        }
     }

     function isDiagonal(cellDiff, rowDiff) {
           if (cellDiff != 0 && rowDiff != 0){//then they clicked diagonally
                return true;
           }
           else{
                return false;
           }
     }

     var count = 0;
      // function to increment value of count variable
     function incrementCount() {
        count++;
        return count;
     }

     function calculateDifference(a, b){
        var val = Math.abs(a - b); //get abs difference
        if (val == 0){
            return 0;
        }
        else { //if not the same then add one to get correct length of ship
            return val + 1;
        }
     }

     function getShipLocations(data) {
          var newArray = [];
          if (data.main_player_ships != null){
              for (var i=0; i < data.main_player_ships.length; i++){
                   for (var j=0; j < data.main_player_ships[i].locations.length; j++){
                      newArray.push(data.main_player_ships[i].locations[j]);
                   }
              }
          }
          else {
             for (var i=0; i< data.length; i++){
                for (var j=0; j<data[i].shipLocations.length; j++){
                    newArray.push(data[i].shipLocations[j]);
                }
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

//        function getOldSalvoData(data) {
//            var result = []
//            if (data[0].turn != null){
//                for( var n=0; n < data.length; n++){
//                        if (data[n].turn != currentTurn){
//                            for (var i = 0; i < data[0].salvoLocations.length ; i++) {
//                                result.push(data[n].salvoLocations[i]);
//                            }
//                        }
//                    }
//                var myNewArray = [].concat.apply([], result);
//            }
//            else{
//                var myNewArray = [];
//            }
//            return myNewArray;
//        }

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
     function salvoGridCreate(data) {
         showSalvoHeader();
         var body = document.getElementById('salvo_grid');
         var tbl = document.createElement('table');
//         tbl.style.width = '35%';
         tbl.setAttribute('border', '1');
         tbl.setAttribute('text-align', 'center');
         tbl.setAttribute('id', 'salvo_table')
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

                    if (checkLocations(getSalvoData(data), cellString) == true) {
                        if (data.gamePlayers){
                            td.style.backgroundColor = "orange"
                            td.appendChild(document.createTextNode(getTurnNumber(data, cellString)));
                        }
                        td.style.backgroundColor = "orange";

                        if (data.gamePlayers == null) {
                            for (var a = 0; a < tempArray.length; a++){
                                if (data[a] == cellString){
                                    var text = currentTurn;
                                    td.appendChild(document.createTextNode(text)); //later get the turn numbers for old and new salvoes
                                    td.style.backgroundColor = "grey";
                                }
                            }
                            if (finalArray[0] != null){
                                for (var b = 0; b < finalArray[0].salvoLocations.length; b++){
                                    if (finalArray[0].salvoLocations[b] == cellString){
                                      var text = currentTurn;
                                      td.appendChild(document.createTextNode(text)); //later get the turn numbers for old and new salvoes
                                      td.style.backgroundColor = "grey";
                                    }
                                }
                            }
                        }
                    }
                    tr.appendChild(td)
                 }
             }
             tbdy.appendChild(tr);
         }
         tbl.appendChild(tbdy);
         body.appendChild(tbl)
         clickToFireSalvos();
     }

     var newArray = [];
     function getSalvoData(data){
//        var newArray = [];
        if (data.gamePlayers != null){
            for (var i=0; i < data.gamePlayers.length; i++){
                if (data.gamePlayers[i].gamePlayer_id == gamePlayer_Id){ //get only one gamePlayer's salvo locations
                    for (var j = 0; j < data.gamePlayers[i].player_info.salvoes.length ; j++){
                       for (var k = 0; k < data.gamePlayers[i].player_info.salvoes[j].locations.length; k++){
                             newArray.push(data.gamePlayers[i].player_info.salvoes[j].locations[k]);
                       }
                    }
                }
            }
        }
        if (data.gamePlayers == null){
            if (data.salvoLocations != null){
               for (var i=0; i< data.length; i++){
                  for (var j=0; j< data[i].salvoLocations.length; j++){
                    newArray.push(data[i].salvoLocations[j]);
                  }
               }
            }
            else{
               for (var i=0; i< data.length; i++){
                 newArray.push(data[i]);
               }
            }
        }

        return newArray;
     }

     function getMaxTurnNumber(data){
        result = "";
         array = [];
         if (data.gamePlayers){
            for (var i=0; i < data.gamePlayers.length; i++){
                if (data.gamePlayers[i].gamePlayer_id == gamePlayer_Id){ //get only one gamePlayer's salvo locations
                    for (var j = 0; j < data.gamePlayers[i].player_info.salvoes.length ; j++){
                       for (var k = 0; k < data.gamePlayers[i].player_info.salvoes[j].locations.length; k++){

                             array.push(data.gamePlayers[i].player_info.salvoes[j].turn);
                             var max = Math.max.apply(null, array);
                             result = max;

                       }
                    }
                }
            }
         }
         else{
            for (var i=0; i < data.length; i++){
                array.push(data[i].turn);
                var max = Math.max.apply(null, array);

                result = max;
            }
         }

         return result;

     }

     function getTurnNumber(data, cellString){
         result = "";
//         newArray = [];
         if (data.gamePlayers){
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
         }
         else{
            for (var i=0; i < data.length; i++){
                result = data[i].turn;
            }
         }

         return result;
     }

});