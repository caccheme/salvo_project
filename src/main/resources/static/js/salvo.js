$(document).ready(function(){
    $.ajax({
      method: "GET",
      url: '/api/games',
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
//                        leaderBoardCreate(data);
                        createGamesList(data);
                        console.log(data);
                        console.log(getGames(data));
                        console.log(getPlayers(data));
                        console.log(getScores(data));
         }
      });//end of ajax

//create list of games for gamePlayer and the scores he/she got
  function createGamesList(data) {
      var games = getGames(data); //need to update this to date format and to include when there are not players or scores
      var scores = getScores(data);
      var players = getPlayers(data); //need update this to include when there are no scores yet....
      var gLen = games.length;
      var text = "<ul> <font size='5'>"   + "Games and Scores:</font></br>";

      for (var i = 0; i < gLen; i++) {
          text += "</br><li> Game Started on:  " + games[i] +
                      "<ul><li>Player:  " + players[i] + "</li><li>  Game Score:   " + scores[i] + "</ul></li>" +
                  "</li>";
      }
      text += "</ul>";
      document.getElementById("games_list").innerHTML = text;

  }

   function getGames(data){
       var result = [];
       for (var i=0; i < data.games.length; i++){
           for (var j=0; j< data.games[i].scores.length; j++){
             if (data.games[i].scores[j]) {
               if(data.games[i].scores[j].email == data.games[i].gamePlayers[j].player.player_email){
                  result.push(data.games[i].game_created);
               }
             }

           }
       }
       return result;
   }

  function getPlayers(data){
      var result = [];
      for (var i=0; i < data.games.length; i++){
          for (var j=0; j< data.games[i].gamePlayers.length; j++){
             result.push(data.games[i].gamePlayers[j].player.player_email);
          }
      }
      return result;
  }


   function getScores(data){
      var result = [];
      for (var i=0; i < data.games.length; i++){
         for (var j=0; j< data.games[i].scores.length; j++){
            if (data.games[i].scores[j]) {
               if(data.games[i].scores[j].email == data.games[i].gamePlayers[j].player.player_email){
                  result.push(data.games[i].scores[j].score);
               }
            }

         }
      }
       return result;
   }

//// what I had that was working
//      $.each(data, function(key, val) {
//        console.log(key); //games
//        console.log(val); //array of objects
//        for (j=0; j<val.length; j++){
//            var date = (new Date(val[j].game_created + (60*60*1000*j)));
//
//                games.push('<li>Date Created:    ' + date +
//                '</li>');
//                    for (i=0; i < val[j].gamePlayers.length; i++) {
//
//                            games.push('<ul><li>Player:    ' + val[j].gamePlayers[i].player.player_email +
//                                            '</li></ul>');
//
//                    };
//        }
//
//      });
//
//      $('<ol/>', {
//        html: games.join('')
//      }).appendTo('div');
//    });


});

