console.log('JS loading: encounterManager.js');

var ENEMIES_BY_MAZE_LEVEL = new Map();


/**
 * sort Enemies By Standard Level 'X'
 * @return returns a list of enemies which standard level is 'X'
 */
function getEnemiesByStandardLevel(lvl) {
	console.log('lvl : ', lvl);
	var enemyList = [];
	ALL_ENEMIES_TEMPLATES_BY_NAME.forEach(function(oneEnemyTemplate) {
		if (oneEnemyTemplate.level == lvl) {
			enemyList.push(oneEnemyTemplate);
		}
	});
	return enemyList;
}

ENEMIES_BY_MAZE_LEVEL.set(1, getEnemiesByStandardLevel(1));
ENEMIES_BY_MAZE_LEVEL.set(2, getEnemiesByStandardLevel(2));







var startFight = function() {
	console.log('F started');
	addMessage('F started');
	// used for action availability: no movements during fights, new actions available, etc.
	isFightning = true;

	// choose an enemy from the appropriate level list
	var thisLevelEnemyList = ENEMIES_BY_MAZE_LEVEL.get(mazeSettings.level);

	// instanciate the enemy (stats, level, etc.)
	var randomEnemyData = getRandomItemFromArray(thisLevelEnemyList);

	//set it to global variable
	theCurrentEnemy = createEnemy(randomEnemyData);

	setEnemyImg();
	setEnemyStats();

	// TODO announce the ennemy
	console.log("%cCurrent Enemy", "color: tomato; font-size:15px;", theCurrentEnemy.name);	
	console.log("%Enemy stats", "color: tomato;", theCurrentEnemy);

	addMessage('What do you do?', 'choice');

	setTimeout(showMazeOverlay, 200);
	setTimeout(showCombatActions, 600);
	// will forbid multiple actions in one turn
	canDoAction = true;
	//showCombatActions();

}





/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
  ______ _       _     _   _                           _   _                 
 |  ____(_)     | |   | | (_)                         | | (_)                
 | |__   _  __ _| |__ | |_ _ _ __   __ _     __ _  ___| |_ _  ___  _ __  ___ 
 |  __| | |/ _` | '_ \| __| | '_ \ / _` |   / _` |/ __| __| |/ _ \| '_ \/ __|
 | |    | | (_| | | | | |_| | | | | (_| |  | (_| | (__| |_| | (_) | | | \__ \
 |_|    |_|\__, |_| |_|\__|_|_| |_|\__, |   \__,_|\___|\__|_|\___/|_| |_|___/
            __/ |                   __/ |                                    
           |___/                   |___/  
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


function combatAttack() {	
	// weapon used as a multiplier of strength
	var damageFromPlayer = player.attack * mapWeaponByName.get(player.weaponName).strength;
	
	// 20% of ignoring enemy's defense
	var enemyProtection = theCurrentEnemy.defense;
	if(Math.random() > 0.8) {
		enemyProtection = 0;
	}

	// final damages dealt
	var damageDealt = damageFromPlayer - enemyProtection;
	theCurrentEnemy.health -= damageDealt;

	// refresh the view
	refreshEnemyStats();

	// won the fight
	if (theCurrentEnemy.health <= 0) {
		theCurrentEnemy.health = 0;
		endFight('victory');
	}
	// keep fighting
	else {
		addMessage('You hit '+ theCurrentEnemy.name + ' for ' + damageDealt + '.\n' + theCurrentEnemy.name + ' has ' + theCurrentEnemy.health + 'hp left.');	
		combatEnemyTurn('combatAttack');
	}
}
function combatDefend() {
	addMessage('No defense option yet');
	combatEnemyTurn('combatDefend');
}
function combatObject() {
	addMessage('No object option yet');
	combatEnemyTurn('combatObject');
}
function combatRun() {
	addMessage('No run option yet');
	combatEnemyTurn('combatRun');
}

function endFight(outcome) {
	var msg = '';
	switch(outcome) {
		case 'victory':
		msg += '* * * * * * * * * * * * * * * * * *<br/>';
		msg += '* * *     V I C T O R Y !!     * * *<br/>';
		msg += '* * * * * * * * * * * * * * * * * *<br/>';
			addMessage(msg, 'victory');
			isFightning = false;
			theCurrentEnemy = null;
		break;
	}
	unsetEnemyImg();	
	hideMazeOverlay();
	hideCombatActions();
}

/**
@param playerActionLastTurn
	'attack'
	'defend'
	'object'
	'run'
*/
function combatEnemyTurn(playerActionLastTurn) {	
	addMessage(theCurrentEnemy.name + ' says hello.', 'enemyAction');

	// allows player to do battle again	
	canDoAction = true;
}








/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
  _    _   _______   _____   _         _____  
 | |  | | |__   __| |_   _| | |       / ____| 
 | |  | |    | |      | |   | |      | (___   
 | |  | |    | |      | |   | |       \___ \  
 | |__| |    | |     _| |_  | |____   ____) | 
  \____/     |_|    |_____| |______| |_____/  

  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
var fightingScene = {
	'actions': $('#actions'),
	'enemyImg': $('#enemyImg'),
	'enemyHp': $('.enemy-hp')
};


function showCombatActions() {
	fightingScene.actions.addClass('show-actions').removeClass('hide-actions');
}
function hideCombatActions() {
	fightingScene.actions.addClass('hide-actions').removeClass('show-actions');
}
function setEnemyImg() {
	debugger;
	fightingScene.enemyImg.attr('src', 'img/enemies/'+theCurrentEnemy.imgName);	
}
function unsetEnemyImg() {
	fightingScene.enemyImg.attr('src', '');	
}
function setEnemyStats() {
	$('.enemy-hp').text(theCurrentEnemy.health);
}
function refreshEnemyStats() {
	setEnemyStats();
}
function unsetEnemyStats() {
	$('.enemy-hp').text('');	
}
function showMazeOverlay() {
	$(mazeOverlay).addClass('showOverlay').removeClass('hideOverlay');
}
function hideMazeOverlay() {
	$(mazeOverlay).addClass('hideOverlay').removeClass('showOverlay');
}




console.log('JS loaded: encounterManager.js');

