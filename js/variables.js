console.log('JS loading: variable.js');

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
   _____            _    _           
  / ____|          | |  (_)          
 | |     ___   ___ | | ___  ___  ___ 
 | |    / _ \ / _ \| |/ / |/ _ \/ __|
 | |___| (_) | (_) |   <| |  __/\__ \
  \_____\___/ \___/|_|\_\_|\___||___/

  = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */
/**
*
*/
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
debugger;
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function eraseCookie(name) {   
  document.cookie = name+'=;expires=-99999999;';  
}

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */



/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
       _  _____  ____  _   _      _          _                 
      | |/ ____|/ __ \| \ | |    | |        | |                
      | | (___ | |  | |  \| |    | |__   ___| |_ __   ___ _ __ 
  _   | |\___ \| |  | | . ` |    | '_ \ / _ \ | '_ \ / _ \ '__|
 | |__| |____) | |__| | |\  |    | | | |  __/ | |_) |  __/ |   
  \____/|_____/ \____/|_| \_|    |_| |_|\___|_| .__/ \___|_|   
                                              | |              
                                              |_|              
                                              = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

// Sérialize une fonction sans l'abimer
var replacer = (key, value) => {  
  // if we get a function to serialize, gives the code for that function  
  if (typeof value === 'function') {
    return value.toString();  
  }   
  return value;
} 

// Deserialize une fonction correctement
var reviver = (key, value) => {  
  if (typeof value === 'string' && value.indexOf('function ') === 0) {
    var functionTemplate = eval('('+value+')');
    return functionTemplate;  
  }  
  return value;
} 


/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */









/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  _____       _ _                     _       _     _           
 |_   _|     (_) |                   (_)     | |   | |          
   | |  _ __  _| |_  __   ____ _ _ __ _  __ _| |__ | | ___  ___ 
   | | | '_ \| | __| \ \ / / _` | '__| |/ _` | '_ \| |/ _ \/ __|
  _| |_| | | | | |_   \ V / (_| | |  | | (_| | |_) | |  __/\__ \
 |_____|_| |_|_|\__|   \_/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/
 = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

 /* init variables */
 var isAdmin = false;
 var isFightning = false;
 var canDoAction = false;
 var mazeSettings;
 var player;

var mazeSettings_FromSavedStatus;
var player_FromSavedStatus;
var continueFromSavedStatus = false;
 /* * * getting game status from SESSION * * */
// mazeSettings_FromSavedStatus = JSON.parse(sessionStorage.getItem('mazeSettings'), reviver);
// player_FromSavedStatus = JSON.parse(sessionStorage.getItem('player'), reviver);
/* * * * * * * * * * * * * * * * * * * * * * */


console.log('loading mazeSettings: ', getCookie('mazeSettings'));
console.log('loading player: ', getCookie('player'));
/* * * getting game status from COOKIES * * */
if(getCookie('mazeSettings') && getCookie('player')) {
  mazeSettings_FromSavedStatus = JSON.parse(getCookie('mazeSettings'));
  player_FromSavedStatus = JSON.parse(getCookie('player'));
  continueFromSavedStatus = true;
}
/* * * * * * * * * * * * * * * * * * * * * * */



var ENEMY_SPAWN_RATE = 0.5;
var theCurrentEnemy;


var ALL_WEAPONS = [
{
  name: 'fists',
  strength: 1,
  description: 'Both fists.'
},
{
  name: 'sword',
  strength: 2.5,
  description: 'An old, short sword.'
}
];

var mapWeaponByName = new Map();
for(var i=0; i<ALL_WEAPONS.length; i++) {
  mapWeaponByName.set(ALL_WEAPONS[i].name, ALL_WEAPONS[i]);
}
console.log('mapWeaponByName : ', mapWeaponByName);

var borderWalls = [
'0-0', '1-0', '2-0', '3-0', '4-0', '5-0', '6-0', '7-0', '8-0', '9-0', '10-0', '11-0', '12-0', '13-0', '14-0', '15-0', '16-0', '17-0', '18-0', '19-0', '20-0',
'20-1', '20-2', '20-3', '20-4', '20-5', '20-6', '20-7', '20-8', '20-9', '20-10', '20-11', '20-12', '20-13', '20-14', '20-15', '20-16', '20-17', '20-18', '20-19', '20-20',
'0-20', '1-20', '2-20', '3-20', '4-20', '5-20', '6-20', '7-20', '8-20', '9-20', '10-20', '11-20', '12-20', '13-20', '14-20', '15-20', '16-20', '17-20', '18-20', '19-20',
'0-1', '0-2', '0-3', '0-4', '0-5', '0-6', '0-7', '0-8', '0-9', '0-10', '0-11', '0-12', '0-13', '0-14', '0-15', '0-16', '0-17', '0-18', '0-19'
];

var someWalls_mazeSettings_h21_w21_outlines = ["16-9", "17-9", "18-9", "19-9", "19-11", "18-11", "17-11", "16-11", "16-12", "16-13", "16-14", "16-15", "16-8", "16-7", "16-6", "16-5", "16-4", "15-4", "14-4", "16-16", "15-16", "14-16", "14-17", "13-17", "12-17", "11-17", "14-3", "13-3", "12-3", "11-3", "10-3", "10-4", "10-16", "10-17", "9-4", "8-4", "7-4", "6-4", "6-3", "6-2", "5-2", "4-2", "3-2", "2-3", "1-4", "1-5", "1-6", "9-16", "8-16", "6-16", "7-16", "6-17", "6-18", "3-18", "4-18", "5-18", "2-17", "1-16", "1-15", "1-14", "1-8", "1-12", "2-7", "2-13", "2-9", "2-11", "1-11", "1-9", "1-7", "1-13", "2-4", "3-3", "2-16", "3-17", "5-3", "5-17"];
var someWalls_mazeSettings_h21_w21_inside = ["13-7", "13-13", "13-11", "13-9", "13-8", "13-10", "13-12", "12-13", "11-13", "10-13", "9-13", "8-14", "7-14", "9-7", "8-6", "7-6", "10-7", "11-7", "12-7", "6-7", "6-13", "5-12", "5-8", "6-9", "6-11", "7-9", "8-9", "7-11", "8-11", "10-10", "11-10", "12-10", "6-6", "5-7", "5-13", "6-14", "9-14", "9-6", "6-12", "6-8"];



var theTable = document.getElementById('table');

if (mazeSettings_FromSavedStatus != null) {
  mazeSettings = mazeSettings_FromSavedStatus;

} else {
  mazeSettings = {
    height: 21,
    width: 21,
    wallPositions: borderWalls.concat(someWalls_mazeSettings_h21_w21_outlines).concat(someWalls_mazeSettings_h21_w21_inside),
    visitedRooms: [],
    level: 1
  }
}







/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */


/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
  _____       _ _     _                       _   _             
 |_   _|     (_) |   | |                     | | (_)            
   | |  _ __  _| |_  | |_ __ _ _ __ __ _  ___| |_ _ _ __   __ _ 
   | | | '_ \| | __| | __/ _` | '__/ _` |/ _ \ __| | '_ \ / _` |
  _| |_| | | | | |_  | || (_| | | | (_| |  __/ |_| | | | | (_| |
 |_____|_| |_|_|\__|  \__\__,_|_|  \__, |\___|\__|_|_| |_|\__, |
                                    __/ |                  __/ |
                                   |___/                  |___/ 
                                   = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */

                                   var mazeOverlay = $('#mazeOverlay');

                                   var saveBtn = $('#save-btn');
                                   var eraseBtn = $('#erase-btn');

/* = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = 
= = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = */










function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomItemFromArray(items) {  
  return items[Math.floor(Math.random()*items.length)];     
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

console.log('JS loaded: variable.js');