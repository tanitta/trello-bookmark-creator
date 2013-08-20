function trelloBookmark(listId) {
	//Make sure the list id is valid
	if (listId == null)
		alert("No list id provided or error getting list id");

	//Determine what page the user is on
	var pageType = "";
	if (document.getElementById("00N400000023eDQ_ileinner") != null)
		pageType = "sgWorkRequest";
	if (document.getElementById("00N400000024KiK_ileinner") != null)
		pageType = "sgProject";
	else if (document.getElementById("cas2j_id0_j_id4_ileinner") != null)
		pageType = "sgCase";

	//If the user is not on a supported page then stop (if commented out then card name = page title and desc = page URL)
	if (pageType == "") {
		alert("Page not supported.");
		return;
	}

	//Load jQuery and the Trello API
	var head = document.getElementsByTagName("head")[0];
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js";
	head.appendChild(script);
	var script2 = document.createElement("script");
	script2.type = "text/javascript";
	script2.src = "https://api.trello.com/1/client.js?key=a06d07618dfbbdb4c0e94b45041c26f3";
	head.appendChild(script2);

	//Wait to continue until jQuery is loaded
	var interval = self.setInterval(function(){
		if(jQuery) {
			window.clearInterval(interval);

			//Logs out the user and reloads the page
			function deauth() {
				Trello.deauthorize();
			}
			
			//Try to authorize without user
			function checkAuth() {
				Trello.authorize({
					interactive: false,
					persist: true,
					error: function() { auth(); },
					success: function() { sendToTrello(); }
				});
			};

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
			};

			//Once the user is logged in this function is fired
			function sendToTrello() {
				//Confirm the submission
				if (window.confirm("Are you sure?")) {
					//Get the card title and description according to the pageType
					switch (pageType) {
						case "sgWorkRequest":
							name = $("#Name_ileinner").text() + " - " + $("#00N400000023eDQ_ileinner").text();
							desc = document.URL.substring(0, 48);
							break;
						case "sgProject":
							name = $("#00N400000024KiK_ileinner").text() + " - " + $("#Name_ileinner").text();
							desc = document.URL.substring(0, 48);
							break;
						case "sgCase":
							name = "CASE-" + $("#cas2j_id0_j_id4_ileinner").text().substring(0, 8) + " - " + $("#cas14j_id0_j_id4_ileinner").text();
							desc = document.URL.substring(0, 92);
							break;
						default:
							name = document.title;
							desc = document.URL;
					}
					
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
			};
			
			$(checkAuth);
		}
	}, 300);
}
