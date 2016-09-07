$(document).ready(function(){
    $.ajax({
      type: "GET",
      url: '/api/games',
      }).done(function ( data ) {
      var games = [];

      $.each(data, function(key, val) {
        var date = (new Date(val.date_created + (60*60*1000*key)));

        console.log(val);

        games.push('<li id="' + key + '"> Date Created:    ' + date +
        '</li>');
            for (i=0; i < 2; i++) {
//               if (val.players.player[i] == getCurrentUser()){
            //not sure how to get currentUser here to compare it to
// will put the link to 'See game' in this conditional so current User can see their game page...
//               }
                if (val.players.player[i] && val.players.score[i] || val.players.player[i] && val.players.score[i] == 0){



                    games.push('<ul><li>Player:    ' + val.players.player[i] + '     Score:     '
                                    + val.players.score[i] +'        <a href="url">See Game</a> </li></ul>');
                };
                if (val.players.player[i] && val.players.score[i] === undefined){
                    if (val.players.player.length < 2){
                            games.push('<ul><li>Player:    ' + val.players.player[i] +
                                                    ' <button id="join_game">Join Game</button>  </li></ul>');
//                                   still to do: create method that supports join game button above
                    }
                    else if (val.players.player.length == 2){
                            games.push('<ul><li>Player:    ' + val.players.player[i] +
                                                    '    Score: N/A (Game still in play)     <a href="url">See Game</a>' +
                                                    '  </li></ul>');
                    }

                };
            };
      });

      $('<ol/>', {
        html: games.join('')
      }).appendTo('div');
    });

});

