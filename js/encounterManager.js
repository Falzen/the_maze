

var ENEMIES_BY_MAZE_LEVEL = new Map();


/**
 * sort Enemies By Standard Level 'X'
 * @return returns a list of enemies which standard level is 'X'
 */
 function getEnemiesByStandardLevel(lvl) {

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

 	addMessage('F started');
	// used for action availability: no movements during fights, new actions available, etc.
	gamestats.isFightning = true;

	// choose an enemy from the appropriate level list
	var thisLevelEnemyList = ENEMIES_BY_MAZE_LEVEL.get(gamestats.mazeSettings.level);

	// instanciate the enemy (stats, level, etc.)
	var randomEnemyData = getRandomItemFromArray(thisLevelEnemyList);

	//set it to global variable
	gamestats.theCurrentEnemy = createEnemy(randomEnemyData);

	setPlayerStats();
	setEnemyImg();
	setEnemyStats();

	// TODO announce the ennemy
	
	

	addMessage('What do you do?', 'choice');

	setTimeout(showMazeOverlay, 200);
	setTimeout(showCombatActions, 600);
	// will forbid multiple actions in one turn
	gamestats.canDoAction = true;
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
*
*/


function combatAttack() {	
	// weapon used as a multiplier of strength
	var damageFromPlayer = gamestats.player.attack * mapWeaponByName.get(gamestats.player.weaponName).strength;
	
	// 20% of ignoring enemy's defense
	var enemyProtection = gamestats.theCurrentEnemy.defense;
	if(Math.random() <= 0.2) {
		enemyProtection = 0;
	}

	// final damages dealt
	var damageDealt = damageFromPlayer - enemyProtection;
	gamestats.theCurrentEnemy.health -= damageDealt;
	// detect overkill here
	gamestats.theCurrentEnemy.health = gamestats.theCurrentEnemy.health < 0 ? 0 : gamestats.theCurrentEnemy.health;

	$('#enemyLife').css('width', ((gamestats.theCurrentEnemy.health*100)/gamestats.theCurrentEnemy.maxHealth) + '%');

	// refresh the view
	refreshEnemyStats();

	// won the fight
	if (gamestats.theCurrentEnemy.health <= 0) {
		gamestats.theCurrentEnemy.health = 0;

		endFight('victory'); // also destroyes gamestats.theCurrentEnemy
	}
	// keep fighting
	else {
		var actionMsg = 'You hit ' 
		+ gamestats.theCurrentEnemy.name 
		+ ' for ' 
		+ damageDealt + '.\n' 
		+ gamestats.theCurrentEnemy.name 
		+ ' has ' 
		+ gamestats.theCurrentEnemy.health 
		+ 'hp left.';
		addMessage(actionMsg, 'playerAction');	
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

		msg	+='			✔	✔	✔	✔	✔	✔	✔	✔	✔	✔	✔	✔	✔	✔<br/>';
		msg	+='		✔	✔	✔	✔	V	I	C	T	O	R	Y	✔	✔	✔	✔	✔<br/>';
		msg	+='			✔	✔	✔	✔	✔	✔	✔	✔	✔	✔	✔	✔	✔	✔<br/>';

		
		addMessage(msg, 'victory');
		gamestats.isFightning = false;
		gamestats.theCurrentEnemy = null;
		break;

		case 'defeat':


		msg +='✞ ✞ ✞<br/>';
		addMessage(msg, 'defeat');
		gamestats.isFightning = false;
		break;
	}
	unsetEnemyImg();	
	hideMazeOverlay();
	hideCombatActions();
}


















/**
@param playerActionLastTurn
	'combatAttack'
	'combatDefend'
	'combatObject'
	'combatRun'
	*/
	var currentEnemySkills = null;
	var weighedSkills = [];
	function combatEnemyTurn(playerActionLastTurn) {
		console.log('>>> combatEnemyTurn START');

		if(currentEnemySkills == null) {
			currentEnemySkills = gamestats.theCurrentEnemy.skills;	
		}

		var shouldUseSkill = Math.random() <= gamestats.theCurrentEnemy.skillUsingRate;
		console.log('gamestats.theCurrentEnemy.skillUsingRate : ', gamestats.theCurrentEnemy);
		console.log('shouldUseSkill : ', shouldUseSkill);
		if(shouldUseSkill) {
			var skillsWeights = [];
			for (var i = 0; i < currentEnemySkills.length; i++) {
				skillsWeights.push(currentEnemySkills[i].triggerRate);
			}
			weighedSkills = generateWeighedList(currentEnemySkills, skillsWeights);
		}


		switch(playerActionLastTurn) {
			case 'combatAttack':break;
			case 'combatDefend':break;
			case 'combatObject':break;
			case 'combatRun':break;

		}

		var damageFromEnemy = gamestats.theCurrentEnemy.attack;
		if(shouldUseSkill) {
			var chosenSkill = getRandomItemFromArray(weighedSkills);
			console.log('chosenSkill : ', chosenSkill);
			damageFromEnemy *= chosenSkill.damageMultiplier;
		}

		// 5% of ignoring enemy's defense
		var playerProtection = gamestats.player.defense;
		if(Math.random() <= 0.05) {
			console.log('Player protection ignored ! (5% chance)');
			playerProtection = 0;
		}

		// final damages dealt
		var damageDealt = damageFromEnemy - playerProtection;
		gamestats.player.health -= damageDealt;


		// refresh the view
		refreshPlayerStats();

		// enemy has won the fight
		if (gamestats.player.health <= 0) {
			gamestats.player.health = 0;

			endFight('defeat');
		}
		// keep fighting
		else {
			var actionMsg = gamestats.theCurrentEnemy.name
			+ ' hits you for ' 
			+ damageDealt + '.\n' 
			+ 'You have ' 
			+ gamestats.player.health 
			+ 'hp left.';
			addMessage(actionMsg, 'enemyAction');	
		}


		$('#playerLife').css('width', ((gamestats.player.health*100)/gamestats.player.maxHealth) + '%');


		refreshPlayerStats();
	// allows player to do battle again	
	gamestats.canDoAction = true;

	console.log('<<< combatEnemyTurn END');
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
  	fightingScene.enemyImg.attr('src', 'img/enemies/'+gamestats.theCurrentEnemy.imgName);
  }
  function unsetEnemyImg() {
  	fightingScene.enemyImg.attr('src', '');	
  }

  function setEnemyStats() {
  	$('.enemy-hp').text(gamestats.theCurrentEnemy.health);
  }
  function refreshEnemyStats() {
  	setEnemyStats();
  }
  function unsetEnemyStats() {
  	$('.enemy-hp').text('');	
  }


  function setPlayerStats() {
  	$('.player-hp').text(''+gamestats.player.health);
  }
  function refreshPlayerStats() {
  	setPlayerStats();
  }
  function unsetPlayerStats() {
  	$('.player-hp').text('');	
  }

  function showMazeOverlay() {
  	$(mazeOverlay).addClass('showOverlay').removeClass('hideOverlay');
  }
  function hideMazeOverlay() {
  	$(mazeOverlay).addClass('hideOverlay').removeClass('showOverlay');
  }






