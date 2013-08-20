//For debuggging 
if (false) {
	Trello.deauthorize();
}

//Try to authorize without user
function checkAuth() {
	//Hide divs
	$("#sec_board").hide();
	$("#sec_list").hide();
	$("#sec_bookmark").hide();

	Trello.authorize({
		interactive: false,
		persist: true,
		error: function() { auth(); },
		success: function() { setupBoards(); }
	});
};

//If automatic authorize fails then authorize with user
function auth() {
	Trello.authorize({
		type: "popup",
		name: "Send to Trello Bookmark Creator",
		persist: true,
		scope: { write: true },
		expiration: "never",
		success: function() { setupBoards(); }
	});
};

//Setup the board selection list
function setupBoards() {
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
	//Trello.token();
	//Trello.key();
	//$("#a_bookmark").attr("href", "javascript:" + "alert(\"" + listId + "\");");
	$("#a_bookmark").attr("href", "javascript:(function(){function b(){if(sendToTrello)sendToTrello(\"" + listId + "\");else setTimeout(b,0)}var a=document.createElement(\"script\");a.setAttribute(\"type\",\"text/javascript\");a.setAttribute(\"charset\",\"UTF-8\");a.setAttribute(\"src\",\"https://raw.github.com/flipxfx/trello-bookmark-creator/master/trelloBookmark.js\");document.body.appendChild(a);setTimeout(b,0)})()");
	$("#sec_bookmark").fadeIn();
};

$(checkAuth);
