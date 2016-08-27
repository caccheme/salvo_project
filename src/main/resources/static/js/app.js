$(function() {

  // display text in the output area for Players
  function showOutput(text) {
    $("#output").text(text);

  }

//  display text in the ordered list area for Games
  function showList(text) {
    $("#ordered_list").text(text);
  }
  
  // load and display JSON sent by server for /players
  function loadData() {
//  commented out the below because using @RequestMapping in SalvoController now instead of JavaScript

    $.get("/rest/players")
    .done(function(data) {
      showOutput(JSON.stringify(data, null, 2));
    })
    .fail(function( jqXHR, textStatus ) {
      showOutput( "Failed: " + textStatus );
    });

//    $.get("/games")
//    .done(function(data) {
//      showList(JSON.stringify(data, null, 2));
//    })
//    .fail(function( jqXHR, textStatus ) {
//      showList( "Failed: " + textStatus );
//    });

  }



  
  // handler for when user clicks add player

  function addPlayer() {
    var name = $("#name").val();
    if (name) {
      var parts = name && name.split(" ");

      postPlayer(parts[0], parts[1] || "Smith");
    }
  }

  // code to post a new player using AJAX
  // on success, reload and data from server

  function postPlayer(firstName, lastName) {
    $.post({
      headers: {
          'Content-Type': 'application/json'
      },
      dataType: "text",
      url: "/rest/players",
      data: JSON.stringify({ "firstName": firstName, "lastName": lastName })
    })
    .done(function( ) {
      showOutput( "Saved -- reloading");
      loadData();
    })
    .fail(function( jqXHR, textStatus ) {
      showOutput( "Failed: " + textStatus );
    });
  }

  $("#add_player").on("click", addPlayer);

  loadData();
});
	  