$(document).ready(function(){
    $.ajax({
      type: "GET",
      url: '/api/games',
      }).done(function ( data ) {
      var games = [];

      $.each(data, function(key, val) {
        var date = (new Date(val.date_created + (60*60*1000*key)));

        console.log(val);

        games.push('<li id="' + key + '">Date Created:    ' + date +
        '</li>');
            for (i=0; i < 2; i++) {
                if (val.players.player[i] && val.players.score[i] || val.players.player[i] && val.players.score[i] == 0){
                    games.push('<ul><li>Player:    ' + val.players.player[i] + '     Score:     '
                                    + val.players.score[i] +'</li></ul>');
                };
                if (val.players.player[i] && val.players.score[i] === undefined){
                    games.push('<ul><li>Player:    ' + val.players.player[i] + '    Score: N/A (Game still in play)   </li></ul>');
                };
            };
      });

      $('<ol/>', {
        html: games.join('')
      }).appendTo('div');
    });

});

