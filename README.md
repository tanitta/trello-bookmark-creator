# Trello Bookmark Creator
The Trello Bookmark Creator is used to create a bookmark to add a webpage to a Trello list as a card. 

### Using the Creator
Working example can be found [here](http://flipxfx.pancakeapps.com/trello-bookmark-creator/index.html). The bookmark creator should work in any browser, but the bookmark itself may not work in IE.

- Login or check for the correct user. 
	- You will need to enable popups to grant the app access from Trello.
- Choose a board. 
	- This is the board that the card will be sent to by the bookmark.
- Choose a list.
	- This is the list that the card will be sent to by the bookmark.
- Drag the bookmark button to your bookmarks bar.
	- The bookmark is created as a link so you are just adding the link's address as a bookmark.
- Go to a webpage you'd like to add to the list.
	- This can be any webpage if you have `allowAllPages` enabled.
- Click the bookmark to send it to the list!
	- The bookmark maybe ask you to grant it access, after granting access the webpage will be added to the list you selected when you created the bookmark.

### Description of Source Files
- index.html - bookmark creator html
- style.css - bookmark creator html
- trelloBookmarkCreator.js - javascript used by the bookmark creator
- trelloBookmark.js - javscript that is run by the bookmark created by the bookmark creator
- readme.md - describes what the Trello Bookmark Creator is and how to use it :P

### Using the Source Files
- Source code is located [here](https://github.com/flipxfx/trello-bookmark-creator).
- To deploy your own creator you will need to change `trelloBookmarkURL` in trelloBookmarkCreator.js to point to your own trelloBookmark.js.
- Currently trelloBookmark.js supports some webpages specifically by using known fields on the page to populate the card instead of using the page title and url for the card title and description.
- You can change trelloBookmark.js to run specifically for you own pages by changing how `pageType` is populated and the `switch (pageType)`.
- In trelloBookmark.js you can change `allowAllPages` to allow\disallow the bookmark to accept page not specifically supported.
