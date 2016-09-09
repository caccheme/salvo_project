$(document).ready(function(){
    $.ajax({
      type: "GET",
      url: '/api/games',
      }).done(function ( data ) {
      var games = [];
      console.log(data);

      $.each(data, function(key, val) {
        for (j=0; j<val.length; j++){
            var date = (new Date(val[j].date_created + (60*60*1000*j)));

                games.push('<li id="' + key + '">Date Created:    ' + date +
                '</li>');
                    for (i=0; i < 2; i++) {
                        if (val[j].players.player[i] && val[j].players.score[i] || val[j].players.player[i] && val[j].players.score[i] == 0){
                            games.push('<ul><li>Player:    ' + val[j].players.player[i] + '     Score:     '
                                            + val[j].players.score[i] +'</li></ul>');
                        };
                        if (val[j].players.player[i] && val[j].players.score[i] === undefined){
                            games.push('<ul><li>Player:    ' + val[j].players.player[i] + '    Score: N/A (Game still in play)   </li></ul>');
                        };
                    };
        }

      });

      $('<ol/>', {
        html: games.join('')
      }).appendTo('div');
    });

});

