//something is off with this...was working and now it isn't...need to work through this
$(document).ready(function(){
    $.ajax({
      method: "GET",
      url: '/api/games',
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
//                        leaderBoardCreate(data); //still to create
                        createGamesList(data);
                        console.log(data);


         }
      });//end of ajax

//create list of games for gamePlayer and the scores he/she got
  function createGamesList(data) {
//      var body = document.getElementsByTagName('div')[2];
      var text = "<ul> <font size='5'> Games and Scores:</font></br>";

      for (var i = 0; i < data.games.length; i++) {
          var doc = document
          var date = (new Date(data.games[i].game_created + (60*60*1000*i)));
          for (var j=0; j< data.games[i].gamePlayers.length ; j++) {
                if (data.games[i].gamePlayers[j].score.length != 0){ //check that score isn't empty
                    text += "<li> Game Started on:  " + date +
                                  "<ul><li>Player:  " + data.games[i].gamePlayers[j].player_email
                                  + "</li><li>  Game Score:   "
                                  + data.games[i].gamePlayers[j].score[0] + "</ul></li>" +
                                  "</li>";
                }
                else { //if no score posted yet
                    text += "<li> Game Started on:  " + date +
                                                      "<ul><li>Player:  " + data.games[i].gamePlayers[j].player_email
                                                      + "</li><li>  Game Score: No score yet </ul></li>" +
                                                      "</li>";
                }
          }
      }
      text += "</ul>";
      document.getElementById("games_list").innerHTML = text;

    }
});