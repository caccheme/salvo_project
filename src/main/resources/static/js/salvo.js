//something is off with this...was working and now it isn't...need to work through this
//$(document).ready(function(){
//    $.ajax({
//      method: "GET",
//      url: '/api/games',
//      dataType: 'json',
//      success: function(data, textStatus, jqXHR) {
////                        leaderBoardCreate(data);
////                        createGamesList(data);
//                        console.log(data);
////                        console.log(getGames(data));
////                        console.log(getPlayers(data));
////                        console.log(getScores(data));
//                        console.log(data.games[0].gamePlayers[0].player[0].score); //for testing
//
//         }
//      });//end of ajax

////create list of games for gamePlayer and the scores he/she got
//  function createGamesList(data) {
////      var games = getGames(data); //need to update this to date format and to include when there are not players or scores
////      var scores = getScores(data);
////      var players = getPlayers(data); //need update this to include when there are no scores yet....
////      var gLen = games.length;
////      var body = document.getElementsByTagName('div')[2];
//      var text = "<ul> <font size='5'> Games and Scores:</font></br>";
//
//      for (var i = 0; i < data.games.length; i++) {
//          var doc = document
//          var date = (new Date(data.games[i].game_created + (60*60*1000*i)));
//          for (var j=0; j< 2; j++) {
//                if (data.games[i].gamePlayers[j].player[k].score){
//                    text += "</br><li> Game Started on:  " + date +
//                                  "<ul><li>Player:  " + data.games[i].gamePlayers[j].player[0].email
//                                  + "</li><li>  Game Score:   "
//                                  + data.games[i].gamePlayers[j].player[0].score + "</ul></li>" +
//                                  "</li>";
//                }
//                else {
//                    text += "</br><li> Game Started on:  " + date +
//                                        "<ul><li>Player:  "
//                                        + data.games[i].gamePlayers[j].player[0].email + "</li>";
//                }
//          }
//      }
//      text += "</ul>";
//      document.getElementById("games_list").innerHTML = text;
//
//  }

$(document).ready(function(){
    $.ajax({
      type: "GET",
      url: '/api/games',
      }).done(function ( data ) {
      var games = [];
///Giving me three lists of the same thing for some reason...need to figure this out later....
      $.each(data, function(key, val) {
         for (j=0; j < val.length; j++){
           var date = (new Date(val[j].game_created + (60*60*1000*j)));
           games.push('<li>Date Created:    ' + date +
           '</li>');

             for (i=0; i < val[j].gamePlayers.length; i++) {
                 if (val[j].gamePlayers[i].player[0] && val[j].gamePlayers[i].player[0].score) {
                       games.push('<ul><li>Player:    ' + val[j].gamePlayers[i].player[0].email + '   Score:  '
                                       + val[j].gamePlayers[i].player[0].score   +
                                       '</li></ul>');
                 }
                 else if (val[j].gamePlayers[i].player[0] && val[j].gamePlayers[i].player[0].email) {
                       games.push('<ul><li>Player:    ' + val[j].gamePlayers[i].player[0].email +
                                       '</li></ul>');
                 }
             }
         }

   });

     $('<ol/>', {
       html: games.join('')
     }).appendTo('div');
    });

});





//// what I had that was working
//      $.each(data, function(key, val) {
//        for (j=0; j<val.length; j++){
//            var date = (new Date(val[j].game_created + (60*60*1000*j)));
//
//                games.push('<li>Date Created:    ' + date +
//                '</li>');
//                    for (i=0; i < val[j].gamePlayers.length; i++) {
//                      if (val[j].gamePlayers[j].player[0].score){
//                            games.push('<ul><li>Player:    ' + val[j].gamePlayers[i].player[0].email + '   Score:  '
//                                            + val[j].gamePlayers[j].player[0].score   +
//                                            '</li></ul>');
//                      }
//                    else {
//                     games.push('<ul><li>Player:    ' + val[j].gamePlayers[i].player[0].email +
//                                            '</li></ul>');
//                    }
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


//});

