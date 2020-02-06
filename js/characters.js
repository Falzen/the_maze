

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
      nextCoord = 1 * (gamestats.player.positions.currentY - 1) + '-' + gamestats.player.positions.currentX;
      if (gamestats.mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        gamestats.player.positions.currentY -= 1;
      }
      break;

      case 'right':
      nextCoord = gamestats.player.positions.currentY + '-' +  (1 * gamestats.player.positions.currentX + 1);
      if (gamestats.mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        gamestats.player.positions.currentX += 1;
      }
      break;

      case 'down':
      nextCoord = 1 * (gamestats.player.positions.currentY + 1) + '-' + gamestats.player.positions.currentX;
      if (gamestats.mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        gamestats.player.positions.currentY += 1;
      }
      break;

      case 'left':
      nextCoord = gamestats.player.positions.currentY + '-' + (1 * gamestats.player.positions.currentX - 1);
      if (gamestats.mazeSettings.wallPositions.indexOf(nextCoord) == -1) {
        gamestats.player.positions.currentX -= 1;
      }
      break;
    }

    enterRoom(nextCoord);
  },
  this.positions = {
    startY: gamestats.mazeSettings.height - 2,
    startX: Math.floor(gamestats.mazeSettings.width / 2),
    nextY: 0,
    nextX: 0,
    currentY: gamestats.mazeSettings.height - 2,
    currentX: Math.floor(gamestats.mazeSettings.width / 2),
    lastY: 0,
    lastX: 0
  }
}

if (gamestats.player_FromSavedStatus != null) {
  gamestats.player = gamestats.player_FromSavedStatus;
}
else {
  gamestats.player = new Player(PLAYER_DEFAULT_SETTINGS);
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
  this.skillUsingRate = settings.skillUsingRate;
  this.skills = settings.skills;
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
  'imgName' : "rabite.gif",
  'skillUsingRate': 0.5,//TODO correct 0.2
  'skills' : [
    {
      'id': 1,
      'triggerRate': 0.5
    }
  ]
  
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
  'imgName' : "beastzombie.gif",
  'skillUsingRate': 0.5,//TODO correct 0.2
  'skills' : [
    {
    'id': 2,
    'triggerRate': 0.5
    }
  ]
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
  'imgName' : "dinofish.gif",
  'skillUsingRate': 0.5,//TODO correct 0.2
  'skills' : [
    {
    'id': 1,
    'triggerRate': 0.5
    },
    {
    'id': 2,
    'triggerRate': 0.2
    }
  ]
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
  enemyTemplate = ALL_ENEMIES_TEMPLATES_BY_NAME.get(enemyName);
  if (enemyTemplate == undefined) {
    return 'No enemy by that name : "' + enemyName + '" in ALL_ENEMIES_TEMPLATES_BY_NAME.';
  }

  $('#enemyLife').css('width', ((enemyTemplate.health*100) / enemyTemplate.maxHealth) + '%');

  var skillsList = [];
  for(var i=0; i<enemyTemplate.skills.length; i++) {
    var oneSkill = getSkillById(enemyTemplate.skills[i].id);
    oneSkill.triggerRate = enemyTemplate.skills[i].triggerRate;
    skillsList.push(oneSkill);
  }



  var temp =  new Enemy({
    'name' : enemyTemplate.name,
    'level' : enemyTemplate.level,
    'maxHealth' : enemyTemplate.maxHealth,
    'health' : enemyTemplate.health,
    'attack' : enemyTemplate.attack,
    'defense' : enemyTemplate.defense,
    'givenXP' : enemyTemplate.givenXP,
    'possibleDrops' : enemyTemplate.possibleDrops,
    'spawnRate' : enemyTemplate.spawnRate,
    'imgName' : enemyTemplate.imgName,
    'skillUsingRate': enemyTemplate.skillUsingRate,
    'skills': skillsList
  });

  return temp;
}









