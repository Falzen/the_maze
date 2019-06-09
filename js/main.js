$(document).ready(function() {

});
console.log('JS loading: main.js');
/*
Enregistrer des données dans sessionStorage
sessionStorage.setItem('clé', 'valeur');

Récupérer des données depuis sessionStorage
var data = sessionStorage.getItem('clé');

Supprimer des données de sessionStorage
sessionStorage.removeItem('clé');

Supprimer toutes les données de sessionStorage
sessionStorage.clear();
*/
/*
git stuff
/c/wamp64/www/perso/2018/maze repo/Maze
https://github.com/Falzen/Maze.git
Falzen
testament2501
*/


/* toggle admin ui and activate methods on top right hidden area doubleclick */
document.getElementById('hiddenAdminBtn').addEventListener('dblclick', function () {
	console.log('test');
	isAdmin = !isAdmin;
	console.log('isAdmin: ', isAdmin);
	refreshAdminUi();
});
function refreshAdminUi() {
	if (isAdmin) {
		$('.admin-ui').addClass('show');
	}
	else {
		$('.admin-ui').removeClass('show');
	}
}



document.addEventListener('keydown', function (ev) {
	console.log('ev.key = ', ev.key);
	// can move if NOT fighting
	if(!isFightning) {
		switch (ev.key) {
			case 'z':
			player.move('up');
			break;

			case 'd':
			player.move('right');
			break;

			case 's':
			player.move('down');
			break;

			case 'q':
			player.move('left');
			break;
		}
	}
	/* is fighting */
	else if (isFightning && canDoAction){
		switch(ev.key) {
			case '1':
			combatAttack();			
			break;
			case '2':
			combatDefend();			
			break;
			case '3':
			combatObject();			
			break;
			case '4':
			combatRun();			
			break;
		}
	}
});


$(saveBtn).click(function (ev) {
	sessionStorage.setItem('mazeSettings', JSON.stringify(mazeSettings, replacer));
	sessionStorage.setItem('player', JSON.stringify(player, replacer));
	console.log('saved player : ', JSON.stringify(player, replacer));
	alert('Saved');
});

$(eraseBtn).click(function (ev) {
	sessionStorage.removeItem('mazeSettings');
	sessionStorage.removeItem('player');
	/*sessionStorage.clear();*/
	alert('Save erased');
	window.location.href = "";
});



$(document).on('click', '.action-btn', function() {
	if(isFightning) {
		var action = this.dataset.action;
		console.log('clicked action : ', action);
		console.log('canDoAction : ', canDoAction);
		// prevents multiple actions in onr turn
		if(canDoAction) {
			switch(action) {
				case 'attack':
				combatAttack();				
				break;

				case 'defend':
				combatDefend();				
				break;

				case 'object':		
				combatObject();				
				break;

				case 'run':
				combatRun();				
				break;

				default:
				break;
			}
		}
	}
});






/**
 * Builds the right kind of room
 * Receives and return the updatedMaze
 * @param {string} coordY
 * @param {string} coordX
 * @param {object} updatedMaze
 */
 function buildRoom(coordY, coordX, updatedMaze) {
 	/* flag */
 	var isRoomCreated = false;

 	/* if wall */
 	if (!isRoomCreated && mazeSettings.wallPositions.indexOf(coordY + '-' + coordX) != -1) {
 		updatedMaze += '<td id="td__' + coordY + '-' + coordX + '" class="is-wall" data-coords=""></td>';
 		isRoomCreated = true;
 	}

 	/* normal new room */
 	if (!isRoomCreated && mazeSettings.visitedRooms.indexOf(coordY + '-' + coordX) == -1) {
 		updatedMaze += '<td id="td__' + coordY + '-' + coordX + '"  class="is-new" data-coords="' + coordY + '-' + coordX + '"></td>';
 		isRoomCreated = true;
 	}

 	/* player position */
 	if (!isRoomCreated && coordY == player.positions.currentY && coordX == player.positions.currentX) {
 		updatedMaze += '<td id="td__' + coordY + '-' + coordX + '" class="player-position" data-coords=""></td>';
 		isRoomCreated = true;
 	}

 	/* normal visited room */
 	if (!isRoomCreated && mazeSettings.visitedRooms.indexOf(coordY + '-' + coordX) != -1) {
 		updatedMaze += '<td id="td__' + coordY + '-' + coordX + '" class="is-visited" data-coords=""></td>';
 		isRoomCreated = true;
 	}
 	
 	return updatedMaze;
 }


/**
 * Create the maze and inserts it into the DOM
 * Uses the static 'mazeSettings'
 */
 function drawMap() {
 	var updatedMaze = '';
 	for (var y = 0; y < mazeSettings.height; y++) {
 		updatedMaze += '<tr class="row__' + y + '">';
 		for (var x = 0; x < mazeSettings.width; x++) {
 			/* player position */
 			updatedMaze = buildRoom(y, x, updatedMaze);
 		}
 		updatedMaze += '</tr>';
 	}
 	theTable.innerHTML = updatedMaze;
 	refreshPlayerPosition();
 }

/**
 * Manages the logic of entering a room
 * @param coords {String} : this room's coordinates, formatted: 'yy-xx';
 */
 function enterRoom(coords) {
 	refreshPlayerPosition();

 	if (!isNewRoom(coords)){
 		return false;
 	}

 	if(roomHasEnemy()) {
 		startFight();
 	}


 	/* à la fin : ajoute la nouvelle room à la liste des visitées */
 	mazeSettings.visitedRooms.push(coords);
 }








/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
  _    _ _______ _____ _       _____ 
 | |  | |__   __|_   _| |     / ____|
 | |  | |  | |    | | | |    | (___  
 | |  | |  | |    | | | |     \___ \ 
 | |__| |  | |   _| |_| |____ ____) |
  \____/   |_|  |_____|______|_____/ 
  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
/**
 * checks if room is already visited 
 * @return boolean
 */
 function isNewRoom(coords) {
 	return mazeSettings.visitedRooms.indexOf(coords) == -1;
 }

/**
 * enemy spawning or not
 * @return boolean
 */
 function roomHasEnemy() {
 	// return Math.random() > ENEMY_SPAWN_RATE;
 	return Math.random() > 0.7;
 }

/**
 * Manage player position
 */
 function refreshPlayerPosition() {
	// blanks outdated position
	erasePlayerPosition();
	// sets new position in the maze
	drawPlayerPosition();
}

/**
Turns player's position into 'visited'
Note: player Object position is updated but not the maze itself yet
*/
function erasePlayerPosition() {
	//$('.player-position').attr('class', 'is-visited');
	$('.player-position').attr('class', 'is-visited');
}

/**
Sets player's current room
Note: updates the the maze itself (<td>)
*/
function drawPlayerPosition() {
	var newPlayerPosition = $("td#td__" + player.positions.currentY + "-" + player.positions.currentX);
	//$(newPlayerPosition).attr('class', 'player-position');
	if (!$(newPlayerPosition).hasClass('is-wall')) {
		$(newPlayerPosition).removeClass('is-visited').addClass('player-position');	
	}
	
}


function addMessage(text, status) {

	if(status == null || status == undefined) {
		status = 'standard';
	}	
	var messageOutput = '<li style="opacity: 0;" class="' + status + '"><p>' + text + '</p></li>';
	var msgList = $('#messages');
	$(msgList).append(messageOutput);
	var height = msgList[0].scrollHeight;
	msgList.scrollTop(height);
}



/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */



/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
   _____                      
  / ____|                     
 | (___   __ ___   _____  ___ 
  \___ \ / _` \ \ / / _ \/ __|
  ____) | (_| |\ V /  __/\__ \
 |_____/ \__,_| \_/ \___||___/
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

/* Save Reminder */
var showSaveReminder = setInterval(function () {
	$('#dont-forget-to-save').toggleClass('is-showing');
	setTimeout(function () {
		$('#dont-forget-to-save').toggleClass('is-showing');
	}, 1500);
}, 20000);

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */   






function init() {
	if(continueFromSession) {
	}
	else {
		mazeSettings.visitedRooms.push(player.positions.startY + '-' + player.positions.startX);
	}
	
	drawMap();
}



console.log('JS loaded: main.js');