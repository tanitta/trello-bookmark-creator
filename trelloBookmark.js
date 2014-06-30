function trelloBookmark(listId) {
  //Indicates if bookmark should allow websites not specifically supported
  var allowAllPages = true;

  //The name and description of the card
  var name = "";
  var desc = "";

  //Make sure the list id is valid
  if (listId == null)
    alert("No list id provided or error getting list id");

  //Load jQuery and the Trello API
  var head = document.getElementsByTagName("head")[0];
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";
  head.appendChild(script);
  var script2 = document.createElement("script");
  script2.type = "text/javascript";
  script2.src = "https://api.trello.com/1/client.js?key=a06d07618dfbbdb4c0e94b45041c26f3";
  head.appendChild(script2);

  //Wait to continue until jQuery is loaded
  var interval = self.setInterval(function(){
    if(jQuery && Trello) {
      window.clearInterval(interval);

      //Determines the name and description of the card then calls checkAuth
      function populateCard() {
        //SG Work Request
        if ($("#00N400000023eDQ_ileinner") != null && $("#00N400000023eDQ_ileinner").text().trim() != "") {
          name = $("#Name_ileinner").text() + " - " + $("#00N400000023eDQ_ileinner").text();
          desc = document.URL.substring(0, 48);
        }
        //SG PPM Project
        else if ($("#00N400000024KiK_ileinner") != null && $("#00N400000024KiK_ileinner").text().trim() != "") {
          name = $("#00N400000024KiK_ileinner").text() + " - " + $("#Name_ileinner").text();
          desc = document.URL.substring(0, 48);
        }
        //SG Case
        else if ($(".cas14j_id0_j_id4_ileinner") != null && $(".cas14j_id0_j_id4_ileinner").text().trim() != "") {
          name = "CASE-" + $(".pageDescription").text().trim() + " - " + $("#cas14j_id0_j_id4_ileinner").text();
          desc = document.URL.substring(0, 92);
        }
        //User is not on a specifically supported page
        else {
          if (allowAllPages) {
            name = document.title;
            desc = document.URL;
          }
          else {
            alert("Page not supported.");
            return;
          }
        }

        checkAuth();
      }

      //Try to authorize without user
      function checkAuth() {
        Trello.authorize({
          interactive: false,
          persist: true,
          error: function() { auth(); },
          success: function() { sendToTrello(); }
        });
      }

      //If automatic authorize fails then authorize with user
      function auth() {
        Trello.authorize({
          type: "popup",
          name: "Trello Bookmark",
          persist: true,
          scope: { write: true, read: true },
          expiration: "never",
          success: function() { sendToTrello(); }
        });
      }

      //Logs out the user
      function deauth() {
        Trello.deauthorize();
      }

      //Once the user is logged in this function is fired
      function sendToTrello() {
        //Confirm the submission
        if (window.confirm("Are you sure?")) {
          //Post the card to Trello
          Trello.post("cards", {
            name: name,
            desc: desc,
            idList: listId
          }, function(data) {
          }, function(data) {
            //If failed, then try a complete reset
            alert("Error posting card, please refresh the page and try again.");
            deauth();
          });
        }
      }

      $(populateCard);
    }
  }, 300);
}
