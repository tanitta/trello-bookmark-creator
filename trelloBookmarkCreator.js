//For troubleshooting
if(false)
	Trello.deauthorize();

//Indicates the URL to the trelloBookmark.js
var trelloBookmarkURL = "https://raw.github.com/flipxfx/trello-bookmark-creator/master/trelloBookmark.js";
//var trelloBookmarkURL = "http://flipxfx.pancakeapps.com/trello-bookmark-creator/trelloBookmark.js";

//Start of page
function init() {
	//Hide/show divs
	$("#sec_board").fadeOut();
	$("#sec_list").fadeOut();
	$("#sec_bookmark").fadeOut();
	$("#sec_user").fadeIn("slow");
	$("#sec_directions").fadeIn("slow");

	//Try to login automatically
	checkAuth();
}

//Try to authorize without user
function checkAuth() {
	Trello.authorize({
		interactive: false,
		persist: true,
		error: function() { checkAuthFailed(); },
		success: function() { setupBoards(); }
	});
};

//If automatic auth fails then provide a button to login manually
function checkAuthFailed() {
    $("#span_user").html("<a href=\"javascript:auth();\" class=\"trelloButton\" id=\"a_login\">Login</a>");
}

//Logs out the user and reloads the page
function deauth() {
	Trello.deauthorize();
	location.reload();
}

//If automatic authorize fails then authorize with user
function auth() {
	Trello.authorize({
		type: "popup",
		name: "Trello Bookmark Creator",
		persist: true,
		scope: { write: true, read: true },
		expiration: "never",
		success: function() { setupBoards(); }
	});
};

//Setup the board selection list
function setupBoards() {
	Trello.members.get("me", function(member){
        $("#span_user").html("<div style=\"padding: 10px 0 0 30px;\">" + member.fullName + "<a href=\"javascript:deauth();\" id=\"a_logout\">Logout</a></div>");
	});

	Trello.get("members/me", {
		boards: "open"
	}, function(data) {
		//Create the board select list and show it
		$("#span_board").append("<select id=\"select_board\"></select>");
		$("#select_board").append("<option value=\"--None--\">--None--</option>");
		for (var i = 0; i < data.boards.length; i++)
			$("#select_board").append("<option value=\"" + data.boards[i].id + "\">" + data.boards[i].name + "</option>");
		$("#sec_board").fadeIn();
		
		//Setup the board onchange function to call the setup lists function if a board is selected
		$("#select_board").change(function () {
			$("#sec_bookmark").fadeOut();
			$("#sec_list").fadeOut(function() { 
				if ($("#select_board").val() != "--None--") 
					setupLists($("#select_board").val());
			});
		});
	});
};

//Setup the list selection list
function setupLists(boardId) {
	Trello.boards.get(boardId, {
		lists: "open"
	}, function(data) {
		//Create the list select list and show it
		$("#span_list").empty();
		$("#span_list").append("<select id=\"select_list\"></select>");
		$("#select_list").append("<option value=\"--None--\">--None--</option>");
		for (var i = 0; i < data.lists.length; i++)
			$("#select_list").append("<option value=\"" + data.lists[i].id + "\">" + data.lists[i].name + "</option>");
		$("#sec_list").fadeIn();

		//Setup the list onchange function to call the setup lists function if a board is selected
		$("#select_list").change(function () {
			$("#sec_bookmark").fadeOut(function() { 
				if ($("#select_list").val() != "--None--")
					makeBookmark($("#select_list").val());
			});
		});
	});
};

//Create the bookmark according to the list currently selected
function makeBookmark(listId) {
	$("#a_bookmark").attr("href", "javascript:(function(){function b(){if(window.trelloBookmark)trelloBookmark(\"" + listId + "\");else setTimeout(b,0)}var a=document.createElement(\"script\");a.setAttribute(\"type\",\"text/javascript\");a.setAttribute(\"charset\",\"UTF-8\");a.setAttribute(\"src\",\"" + trelloBookmarkURL + "\");document.body.appendChild(a);setTimeout(b,0)})()");
	$("#sec_bookmark").fadeIn();
};

$(init);
