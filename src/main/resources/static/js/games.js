$(document).ready(function(){
        $.ajax({
          method: "GET",
          url: '/api/games',
          dataType: 'json',
          success: function(data, textStatus, jqXHR) {
                        createGamesList(data);
                        leaderBoardCreate(data);
                        console.log(data);
         }
      });//end of ajax

 //for games.html no 'join game', and checks to see if anyone signed in, included in the below logic
    //create list of games for gamePlayer and the scores he/she got
      function createGamesList(data) {
          var text = "<ul> <font size='5'> Games and Scores:</font></br>";

          for (var i = 0; i < data.games.length; i++) {
          var doc = document
          var date = (new Date(data.games[i].game_created + (60*60*1000*i)));
              text += "<li> Game Started on:   " + date;
              for (var j=0; j< data.games[i].gamePlayers.length ; j++) {
                  if(data.games[i].gamePlayers[j].score != null){//game has score
                        text += "<ul><li>Player:  " + data.games[i].gamePlayers[j].player_email
                                    + ",  Game Score:   " + data.games[i].gamePlayers[j].score + "</li></ul></li>";
                  }
                  else if (data.games[i].gamePlayers[j].score == null) {//no score yet
                        text += '<ul><li>Player:    ' + data.games[i].gamePlayers[j].player_email
                                    + '    Score: N/A (Game still in play)  </li></ul></li>';
                  }
              }
          }
          text += "</ul>";
          document.getElementById("games_list").innerHTML = text;

      }

    //LeaderBoard for gamePlayer tallies
    function leaderBoardCreate(data) {
             var body = document.getElementsByTagName('div')[0];
             var tbl = document.createElement('table');
             tbl.setAttribute('border', '1');
             tbl.setAttribute('text-align', 'center');
             var tbdy = document.createElement('tbody');
             var emails = getEmails(data);
             var length = emails.length + 1;//make table as long as number of unique emails + 1 for headers

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
                             td.appendChild(document.createTextNode(emails[i-1]))
                             tr.appendChild(td)
                      }
                     //inner data:
                     if (i > 0 && j == 1){
                     //total
                         var td = document.createElement('td');
                             td.appendChild(document.createTextNode(findTotalGamesForPlayer(data, emails[i-1])))
                             tr.appendChild(td)
                     }
                     if (i > 0 && j == 2){
                     //won
                        var td = document.createElement('td');
                            td.appendChild(document.createTextNode(findWinsForPlayer(data, emails[i-1])));
                            tr.appendChild(td);
                     }

                     if (i > 0 && j ==3){
                     //lost
                         var td = document.createElement('td');
                             td.appendChild(document.createTextNode(findLostForPlayer(data, emails[i-1])))
                             tr.appendChild(td)
                     }

                     if (i > 0 && j == 4){
                     //tied
                         var td = document.createElement('td');
                             td.appendChild(document.createTextNode(findTiesForPlayer(data, emails[i-1])))
                             tr.appendChild(td)
                     }
                 }
                 tbdy.appendChild(tr);
             }
             tbl.appendChild(tbdy);
             body.appendChild(tbl);
         }

    function getEmails(data){
        var arr = [];
        //create array of emails only, will have duplicates
        for (i=0; i< data.games.length; i++) {
            for (j=0; j< data.games[i].gamePlayers.length; j++){
                arr.push(data.games[i].gamePlayers[j].player_email);
            }
        }

        var uniqueNames = [];
        $.each(arr, function(i, el){
            if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        return uniqueNames; //["j.bauer@ctu.gov", "c.obrian@ctu.gov", "t.almeida@ctu.gov", "palmer@whitehouse.gov"]
    }

    function getAllScores(data, emails){
        var scores = [];
        for (var i=0; i< emails.length; i++){
            scores.push(getPlayerScores(data, emails[i])); //get score data for the specific player
        }
        return scores;
    }

    function getPlayerScores(data, email){ //email is going to be a comparator to get a scores array for each player
        var arr = [];
        //create array of scores for each player
        for (i=0; i < data.games.length; i++) { //say games.length undefined but console.log can find it...?
            for (j=0; j < data.games[i].gamePlayers.length; j++){
                if (data.games[i].gamePlayers[j].player_email == email && data.games[i].gamePlayers[j].score){
                    arr.push(data.games[i].gamePlayers[j].score) //collect scores per email
                }
            }
        }
        return arr;
    }

    function findTotalGamesForPlayer(data, email){
        return getPlayerScores(data, email).length;
    }

    function findWinsForPlayer(data, email){
        var count = 0;
        for (i=0; i < data.games.length; i++) {
            for (j=0; j< data.games[i].gamePlayers.length; j++){
                if (data.games[i].gamePlayers[j].player_email == email){
                    if (data.games[i].gamePlayers[j].score === 1){
                                    count++;
                    }
                }
            }
        }
        return count;
    }

   function findTiesForPlayer(data, email){
        var count = 0;
        for (i=0; i < data.games.length; i++) {
            for (j=0; j< data.games[i].gamePlayers.length; j++){
                if (data.games[i].gamePlayers[j].player_email == email){
                    if (data.games[i].gamePlayers[j].score === 0.5){
                                    count++;
                    }
                }
            }
        }
        return count;
    }


    function findLostForPlayer(data, email){
        var count = 0;
        for (i=0; i < data.games.length; i++) {
            for (j=0; j< data.games[i].gamePlayers.length; j++){
                if (data.games[i].gamePlayers[j].player_email == email){
                    if (data.games[i].gamePlayers[j].score === 0){
                                    count++;
                    }
                }
            }
        }
        return count;
    }

});
