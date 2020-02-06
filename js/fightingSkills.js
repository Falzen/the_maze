var attacks = [
{
	'id': '1',
	'name': 'scratch',
	'damageMultiplier': 1.2,
	'cost': 1
},
{
	'id': '2',
	'name': 'bite',
	'damageMultiplier': 1.5,
	'cost': 3
}
];
var skillsIdMap = new Map();
for(var i=0; i<attacks.length; i++) {
	skillsIdMap.set(attacks[i].id, attacks[i]);
}

function getSkillById(aid) {
	var strKey = ''+aid+'';
	console.log('strKey : ', strKey);
	console.log('attacksByIdMap : ', skillsIdMap);
	console.log('skillsIdMap.get(strKey) : ', skillsIdMap.get(strKey));
	return skillsIdMap.get(strKey);
}


function generateWeighedList(list, weights) {
	// if only one item then no need to temperate
	if(list.length == 1) {
		return list;
	}

	var weighed_list = [];
    // for each weight
    for (var i = 0; i < weights.length; i++) {
    	var multiples = weights[i] * 100;
        // add as many items as its weight (*100)
        for (var j = 0; j < weights[i]; j += 0.01) {
        	weighed_list.push(list[i]);
        }
    }
    
    return weighed_list;
};
