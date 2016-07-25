$(document).ready(function(){
    var gamePlayer_Id = getParameterByName('gp');

    if (gamePlayer_Id){
        //get scores data for a specific gamePlayer_Id
          $.ajax({
                method: "get",
                url: '/api/gpScores/'+ gamePlayer_Id,
                dataType: 'json',
                success: function(scoreData, textStatus, jqXHR) {
                           leaderBoardCreate(scoreData);

                }
          });//end ajax

          $.ajax({
                method: "get",
                url: '/api/gpGames/'+ gamePlayer_Id,
                dataType: 'json',
                success: function(gameData, textStatus, jqXHR) {
                         createGamesList(gameData);

                }
          });//end ajax


    }
    else {
     //get scores data for a specific gamePlayer_Id
        $.ajax({
             method: "get",
             url: '/api/scores',
             dataType: 'json',
             success: function(scoreData, textStatus, jqXHR) {
                        leaderBoardCreate(scoreData);
             }
        });//end ajax
    }

//still to do...create list of games for gamePlayer and the scores he/she got
//right now just shows that the gameData object is being passed to the html
    function createGamesList(gameData) {
        var games = gameData;
        document.getElementById("games_list").innerHTML = games;

    }

    //table or LeaderBoard for gamePlayer tallies
    function leaderBoardCreate(scoreData) {
             var body = document.getElementsByTagName('div')[0];
             var tbl = document.createElement('table');
             tbl.setAttribute('border', '1');
             tbl.setAttribute('text-align', 'center');
             var tbdy = document.createElement('tbody');
             if (gamePlayer_Id){
                var length = 2; // make table two rows, one for player info and one for header info
                var email = [];
                email.push(scoreData.email);
                var data = [];
                data.push(scoreData);
             }
             else {
                var length = getEmails(scoreData).length + 1; //make table as long as number of unique emails + 1 for headers
                var email = getEmails(scoreData);
                var data = scoreData;
             }
             for (var i = 0; i < length; i++) {
                 var tr = document.createElement('tr');
                 for (var j = 0; j < 5; j++) {
                     //column headers
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
                     if (i == 0 && j == 4) {
                     // output headers for grid
                        var td = document.createElement('td');
                            td.appendChild(document.createTextNode("Tied"))
                               tr.appendChild(td)
                     }
                     //row headers
                      if (j == 0 && i > 0){
                         var td = document.createElement('td')
                             td.appendChild(document.createTextNode(email[i-1]))
                             tr.appendChild(td)
                      }
                     //inner data:
                     if (i > 0 && j == 1){
                     //total
                         var td = document.createElement('td');
                             td.appendChild(document.createTextNode(findTotalGamesForPlayer(data, email[i-1])))
                             tr.appendChild(td)
                     }
                     if (i > 0 && j == 2){
                     //won
                        var td = document.createElement('td');
                            td.appendChild(document.createTextNode(findWinsForPlayer(data, email[i-1])))
                            tr.appendChild(td)
                     }

                     if (i > 0 && j ==3){
                     //lost
                         var td = document.createElement('td');
                             td.appendChild(document.createTextNode(findLostForPlayer(data, email[i-1])))
                             tr.appendChild(td)
                     }

                     if (i > 0 && j == 4){
                     //tied
                         var td = document.createElement('td');
                             td.appendChild(document.createTextNode(findTiesForPlayer(data, email[i-1])))
                             tr.appendChild(td)
                     }
                 }
                 tbdy.appendChild(tr);
             }
             tbl.appendChild(tbdy);
             body.appendChild(tbl);
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

    function getEmails(scoreData){
        var arr = [];
        //create array of emails only, will have duplicates
        for (i=0; i< scoreData.length; i++) {
                arr.push(scoreData[i].email)
            }

        var uniqueNames = [];
        $.each(arr, function(i, el){
            if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        return uniqueNames;
    }

    function findTotalGamesForPlayer(scoreData, email){
        var result = "";
        for (i=0; i<scoreData.length; i++) {
            if (scoreData[i].email == email){
                result = scoreData[i].scores.length
            }
        }
        return result;
    }

    function findWinsForPlayer(scoreData, email){
        var result = "";
        for (i=0; i<scoreData.length; i++) {
            if (scoreData[i].email == email){
                result = countScoreType(scoreData[i].scores, 1)
            }
        }
        return result;
    }

    function findTiesForPlayer(scoreData, email){
        var result = "";
        for (i=0; i<scoreData.length; i++) {
            if (scoreData[i].email == email){
                result = countScoreType(scoreData[i].scores, 0.5)
            }
        }
        return result;
    }

    function findLostForPlayer(scoreData, email){
        var result = "";
        for (i=0; i<scoreData.length; i++) {
            if (scoreData[i].email == email){
                result = countScoreType(scoreData[i].scores, 0)
            }
        }
        return result;
    }
});