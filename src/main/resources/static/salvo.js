$(function() {

    $.ajax({
      type: "GET",
      url: '/api/games',
      }).done(function ( data ) {
      var items = [];

      $.each(data, function(key, val) {
        items.push('<li id="' + key + '">Date Created:' + val.date_created + '</li>');
      });

      $('<ol/>', {
        'class': 'my-new-list',
        html: items.join('')
      }).appendTo('body');
    });

})


// //is working at index.html to give same as /games
//  var items = $( "#gamesList" ).load( "/games", function(i) {
//    alert( "Load was performed." );
//  });


    // //example from stackoverlow that I got working
//      var countries = ['United States', 'Canada', 'Argentina', 'Armenia'];
//      var cList = $('ol')
//      $.each(countries, function(i)
//      {
//          var li = $('<li/>')
//          .text(countries[i])
//          .appendTo(cList);
//
//      });

