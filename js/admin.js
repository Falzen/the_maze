



/* Adding new walls */
if (isAdmin) {

	var newWalls = [];
	$('td').click(function () {
		if (newWalls.indexOf(this.dataset.coords) == -1) {
			newWalls.push(this.dataset.coords);
			$(this).attr('class', 'is-wall');
		} else {
			newWalls.splice(newWalls.indexOf(this.dataset.coords));
			$(this).attr('class', 'is-new');
		}

	});
	$('#show-array').click(function () {
		console.log('= = = = = = = = = = = = = = = = = = = = = = = = = ');
		console.log('= = = = = = = = = = = = = = = = = = = = = = = = = ');
		console.log('var newWalls = ' + JSON.stringify(newWalls) + ';');
		console.log('= = = = = = = = = = = = = = = = = = = = = = = = = ');
		console.log('= = = = = = = = = = = = = = = = = = = = = = = = = ');
	});
}