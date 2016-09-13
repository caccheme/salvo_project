$(document).ready(function(){
    $.ajax({
      type: "GET",
      url: '/api/games',
      }).done(function ( data ) {
      var games = [];
      console.log(data);
      console.log(data.games);
      console.log(data.games[0]);
      console.log(data.games[0].game_created);//should give game date
      console.log(data.games[0].gamePlayers);
      console.log(data.games[0].gamePlayers[0]);
      console.log(data.games[0].gamePlayers[0].player.player_email);

      $.each(data, function(key, val) {
        console.log(key); //games
        console.log(val); //array of objects
        for (j=0; j<val.length; j++){
            var date = (new Date(val[j].game_created + (60*60*1000*j)));

                games.push('<li>Date Created:    ' + date +
                '</li>');
                    for (i=0; i < val[j].gamePlayers.length; i++) {

                            games.push('<ul><li>Player:    ' + val[j].gamePlayers[i].player.player_email +
                                            '</li></ul>');

                    };
        }

      });

      $('<ol/>', {
        html: games.join('')
      }).appendTo('div');
    });

});

