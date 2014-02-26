var Snake = MoveableEntity.extend({
	init: function() {
		this._super.apply(this, arguments);

		this.direction = Snake.DIR.NORTH;

		this.body = [{
			x: this.x,
			y: this.y
		}];
	},

	update: function(next, food) {
		// Push next position to front
		if (!food) {
			this.body.pop();
		}
		this.body.unshift(next);

		// If not food, pop last
		
	},

	getHead: function() {
		return this.body[0];
	},

	getDirection: function() {
		return this.direction;
	},

	setDirection: function(direction) {
		this.direction = direction;
	},

	getBody: function() {
		return this.body;
	},

	isCollidingWithSelf: function(next) {
        for (var i = 0, l = this.body.length; i < l; i++) {
        	if (next.x == this.body[i].x && next.y == this.body[i].y) {
        		return true;
        	}
        }
        return false;
	}

});

Snake.DIR = {
	NORTH: 0,
	SOUTH: 1,
	EAST: 2,
	WEST: 3
};