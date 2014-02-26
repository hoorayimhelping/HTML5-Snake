var Grid = Class.extend({
	init: function(x, y) {

	},

	getGridPoints: function() {
		var points = [];
		for (var i = this.x; i < this.x + Grid.BLOCK_SIZE; i++) {
			for (var j = this.y; j < this.y + Grid.BLOCK_SIZE; j++) {
				points.push([i, j]);
			}
		}
	}
});

Grid.BLOCK_SIZE = 15;
