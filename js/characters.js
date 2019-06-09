
console.log('JS loading: character.js');
//http://shrines.rpgclassics.com/snes/som/enemiesf.shtml


var PLAYER_DEFAULT_SETTINGS = {
  'name': 'theName',
  'level': 1,
  'maxHealth': 100,
  'health': 100,
  'attack': 10,
  'defense': 2,
  'weaponName': 'fists',
  'armorName': 'shirt'
}

/**
 * Implémentée par Player et Enemy
 */
 var Character_Template = function(settings) {
  this.name = settings.name;
  this.level = settings.level;
  this.maxHealth = settings.maxHealth;
  this.health = settings.health;
  this.attack = settings.attack;
  this.defense = settings.defense;
}


/**
 * Une seule instanciation
 * @param {string} name
 * @param {integer} level
 * @param {integer} maxHealth
 * @param {integer} health
 * @param {integer} attack
 * @param {integer} defense
 * @param {string} weaponName
 * @param {string} armorName
 */
 var Player = function(settings) {
 	Character_Template.call(this, settings);
 	this.currentXP = 0;
 	this.weaponName = settings.weaponName;
 	this.armorName = settings.armorName;
 	this.nextLevelsList = [];
 	this.move = function (dir) {
    var nextCoord = '';
    switch (dir) {
      case 'up':
      nextCoord = 1 * (player.positions.currentY - 1) + '-' + player.positions.currentX;
      if (mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        player.positions.currentY--;
      }
      break;

      case 'right':
      nextCoord = player.positions.currentY + '-' +  (1 * player.positions.currentX + 1);
      if (mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        player.positions.currentX++;
      }
      break;

      case 'down':
      nextCoord = 1 * (player.positions.currentY + 1) + '-' + player.positions.currentX;
      if (mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        player.positions.currentY++;
      }
      break;

      case 'left':
      nextCoord = player.positions.currentY + '-' + (1 * player.positions.currentX - 1);
      if (mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        player.positions.currentX--;
      }
      break;
    }

    enterRoom(nextCoord);
    /*
    if (dir == 'up') {
      nextCoord = 1 * (player.positions.currentY - 1) + '-' + player.positions.currentX;
      if (mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        player.positions.currentY--;
      }
    }
    else if (dir == 'right') {
      nextCoord = player.positions.currentY + '-' +  (1 * player.positions.currentX + 1);
      if (mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        player.positions.currentX++;
      }
    }
    else if (dir == 'down') {
      nextCoord = 1 * (player.positions.currentY + 1) + '-' + player.positions.currentX;
      if (mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        player.positions.currentY++;
      }
    }
    else if (dir == 'left') {
      nextCoord = player.positions.currentY + '-' + (1 * player.positions.currentX - 1);
      if (mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        player.positions.currentX--;
      }
    }
    enterRoom(nextCoord);
    */
  },
  this.positions = {
    startY: mazeSettings.height - 2,
    startX: Math.floor(mazeSettings.width / 2),
    nextY: 0,
    nextX: 0,
    currentY: mazeSettings.height - 2,
    currentX: Math.floor(mazeSettings.width / 2),
    lastY: 0,
    lastX: 0
  }
}

if (player_FromSavedStatus != null) {
  player = player_FromSavedStatus;
}
else {
  player = new Player(PLAYER_DEFAULT_SETTINGS);
}




/**
 * Modèle pour Enemies
 * @param {string} name
 * @param {integer} level
 * @param {integer} maxHealth
 * @param {integer} health
 * @param {integer} attack
 * @param {integer} defense
 * @param {integer} givenXP
 * @param {items[]} possibleDrops
 * @param {integer} spawnRate
 * @param {string} imgName
 */
 var Enemy = function(settings) {
 	Character_Template.call(this, settings);
 	this.givenXP = settings.givenXP;
 	this.possibleDrops = settings.possibleDrops;
 	this.spawnRate = settings.spawnRate;
 	this.imgName = settings.imgName;
 }


 /* tous les ennemies */ 
 var ENEMY_SETTINGS_rabite = {
 	'name' : "rabite",
 	'level' : 1,
 	'maxHealth' : 22,
 	'health' : 22,
 	'attack' : 8,
 	'defense' : 1,
 	'givenXP' : 10,
 	'possibleDrops' : [],
 	'spawnRate' : 75,
 	'imgName' : "rabite.gif"
 }
 var ENEMY_SETTINGS_beastzombie = {
 	'name' : "beastzombie",
 	'level' : 1,
 	'maxHealth' : 22,
 	'health' : 22,
 	'attack' : 8,
 	'defense' : 1,
 	'givenXP' : 10,
 	'possibleDrops' : [],
 	'spawnRate' : 75,
 	'imgName' : "beastzombie.gif"
 }
 var ENEMY_SETTINGS_dinofish = {
 	'name' : "dinofish",
 	'level' : 1,
 	'maxHealth' : 22,
 	'health' : 22,
 	'attack' : 8,
 	'defense' : 1,
 	'givenXP' : 10,
 	'possibleDrops' : [],
 	'spawnRate' : 75,
 	'imgName' : "dinofish.gif"
 }

/* 
alimenter cette Map avec les nouveaux ennemies,
exemple avec rabite :
ALL_ENEMIES_TEMPLATES_BY_NAME.set(obj_rabite.name, obj_rabite);
*/
var ALL_ENEMIES_TEMPLATES_BY_NAME = new Map();
ALL_ENEMIES_TEMPLATES_BY_NAME.set(ENEMY_SETTINGS_rabite.name.toLowerCase(), ENEMY_SETTINGS_rabite);
ALL_ENEMIES_TEMPLATES_BY_NAME.set(ENEMY_SETTINGS_beastzombie.name.toLowerCase(), ENEMY_SETTINGS_beastzombie);
ALL_ENEMIES_TEMPLATES_BY_NAME.set(ENEMY_SETTINGS_dinofish.name.toLowerCase(), ENEMY_SETTINGS_dinofish);

/**
 * Enemy Factory
 * @param {string} enemyName
 * @return {Enemy} || {string} : message d'erreur
 * prend les infos dans la Map ALL_ENEMIES_TEMPLATES_BY_NAME avec le nom reçu
 */

 function createEnemy(enemyData) {
  var standardLevel = ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).level;
  createEnemy(enemyData, standardLevel);
}
function createEnemy(enemyData, enemyLevel) {

  enemyName = enemyData.name.toLowerCase();
  if (ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName) == undefined) {
   return 'No enemy by that name : "' + enemyName + '" in ALL_ENEMIES_TEMPLATES_BY_NAME.';
 }

 return new Enemy({
   'name' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).name,
   'level' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).level,
   'maxHealth' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).maxHealth,
   'health' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).health,
   'attack' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).attack,
   'defense' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).defense,
   'givenXP' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).givenXP,
   'possibleDrops' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).possibleDrops,
   'spawnRate' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).spawnRate,
   'imgName' : ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName).imgName
   });
}







console.log('JS loaded: character.js');

