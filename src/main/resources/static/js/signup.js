$(document).ready(function(){

    document.forms.signup.onsubmit =
        function(event) {
        return validateSignupForm(event);
      };

      function validateEmail(emailField) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailField.value)){
            return ""
        }
        else {
            return "The email field needs a valid email.\n";
        }
    };

    function validatePassword(passwordField) {
        if (passwordField.value === ""){
            return "The password field needs to be filled in.\n";
        }
        else {
            return ""
        }
    };

    function validateSignupForm(event) {
       var form = event.target;
       var messages = validateEmail(form.email) + validatePassword(form.password);
       var email = form.email.value;
       var password = form.password.value;
       if (messages === ""){
            $.post({
                      url: "/api/players/" + email + "/" + password,
                      dataType: "json",
                    })
                    .done(function (data, status, jqXHR) { //data is undefined...
                      alert( "User Created: " + data.email);
                      location.href = "games.html"; //look into how to log someone in automatically...inside java code
                    })
                    .fail(function (jqXHR, status, httpError) {
                      alert("Error: " + status + " " + httpError);
                    });
       }
       else{
           alert(messages);
       }
       return false; //prevents it from submitting the form
    }

});
