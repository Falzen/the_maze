// http://shrines.rpgclassics.com/snes/som/items.shtml

/**
 * Implémentée par Item, Weapons, Armor
 */
 var Item_Template = function(settings) {
 	this.name = settings.name;
 	this.description = settings.description;
 	this.buyingPrice = settings.buyingPrice;
 	this.sellingPrice = settings.sellingPrice;
 }


/**
 * Modèle pour les items 
 * @param {string} name
 * @param {string} description
 * @param {integer} buyingPrice
 * @param {integer} sellingPrice
 * @param function() action 
 */
 var Item = function(settings) {
 	Object_Template.call(this, settings);
 	this.action = settings.action;
 }

 var item_bonbon = {
 	'name' : "bonbon",
 	'description' : 'Un bonbon.',
 	'buyingPrice' : 25,
 	'sellingPrice' : 8,
 	'action' : function() {
 		return 'item action works';
 	}
 }

/* 
alimenter cette Map avec les nouveaux objets,
exemple avec bonbon :
ALL_ITEMS_TEMPLATES_BY_NAME.set(item_bonbon.name, item_bonbon);
*/
var ALL_ITEMS_TEMPLATES_BY_NAME = new Map();
ALL_ITEMS_TEMPLATES_BY_NAME.set(item_bonbon.name, item_bonbon);


/**
* Item Factory
* @param {string} itemName
* @return {Item} || {string} : message d'erreur
* prend les infos dans la Map ALL_ITEMS_TEMPLATES_BY_NAME avec le nom reçu
*/
function createItem(itemName) {
	itemName = itemName.toLowerCase();
	if (ALL_ITEMS_TEMPLATES_BY_NAME.get(itemName) == undefined) {
		return 'No item by that name : "' + itemName + '" in ALL_ITEMS_TEMPLATES_BY_NAME.';
	}
	return new Item({
		'name': ALL_ITEMS_TEMPLATES_BY_NAME.get(itemName).name,
		'description': ALL_ITEMS_TEMPLATES_BY_NAME.get(itemName).description,
		'buyingPrice': ALL_ITEMS_TEMPLATES_BY_NAME.get(itemName).buyingPrice,
		'sellingPrice': ALL_ITEMS_TEMPLATES_BY_NAME.get(itemName).sellingPrice,
		'action': ALL_ITEMS_TEMPLATES_BY_NAME.get(itemName).action
	});
}