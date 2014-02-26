var GameController = Class.extend({
    init: function(canvas_element) {
        this.canvas = canvas_element;
        this.context = this.canvas.getContext('2d');

        this.paused = false;
        this.block_size = 20;

        this.snake = new Snake({
            x: 15, y: 15
        });

        this.food = null;

        this.game_over = false;

        this.skipped_frames = 0;
        this.frames_to_skip = 4;

        this.start_screen = true;
        this.height = this.canvas.height / this.block_size;
        this.width = this.canvas.width / this.block_size;

        this.score = 0;

        this.renderStartScreen();
        this.bindKeys();
        this.spawnFood();
        
    },

    // game world updates go here 
    update: function() {
        if (this.start_screen) {
            return;
        }

        if (this.count_down) {
            this.renderDown();
            return;
        }

        if (this.game_over) {
            this.renderGameOver();
            return;
        }

        requestAnimationFrame(this.update.bind(this));
        if (this.paused) {
            this.render();
            return;
        }

        var next = this.getNextPosition();

        if (this.skipped_frames < this.frames_to_skip) {
            this.skipped_frames++;
            return;
        }

        this.skipped_frames = 0;

        // Is next outside boder then fail
        if(this.detectCollisions(next)) {
            this.paused = true;
            this.game_over = true;
            return;
        }

        var eating = false;
        if(this.isCollidingWithFood(next)) {
            console.log('colliding with food');
            this.updateScore();
            this.food = null;

            eating = true;
            this.spawnFood();
        } 

        // IS colliding with self
        if(this.snake.isCollidingWithSelf(next)) {
            this.paused = true;
            this.game_over = true;
            return;
        }

        this.snake.update(next, eating);
        this.render();
    },

    // rendering calls go here 
    render: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = '#f00';
        
        this.renderFood();

        this.context.fillStyle = '#000';

        this.renderSnake();
    },

    renderGameOver: function() {
        this.context.font = "30px helvetica";
        var text_gradient = this.context.createLinearGradient(0, 0, 300, 0);
        text_gradient.addColorStop('0', 'red');
        text_gradient.addColorStop('0.5', 'orange');
        text_gradient.addColorStop('1', 'yellow');
        this.context.fillStyle = text_gradient;
        this.context.fillText('Game Over Scrub. Score = ' + this.score, this.width / 0.5, this.height / 0.5);
    },

    renderStartScreen: function() {
        this.context.font = "30px helvetica";
        this.context.fillStyle = 'black';
        this.context.fillText('PRESS A BUTTON TO PLAY', this.width / 0.5, this.height / 0.5);
    },

    detectCollisions: function(next) {
        if (next.x < 0 || next.y < 0 || next.x >= this.width || next.y >= this.height) {
            return true;
        }

        return false;

    },

    renderSnake: function() {
        var snake_body = this.snake.getBody();
        for (var i = 0, l = snake_body.length; i < l; i++) {
            var body_bit = snake_body[i],
                render_x = body_bit.x * this.block_size,
                render_y = body_bit.y * this.block_size;

            this.context.fillRect(render_x, render_y, this.block_size, this.block_size);
        }
    },

    spawnFood: function() {
        do   {
            
            this.food = {
                x: Math.round(Math.random() * (this.width - 1)),
                y: Math.round(Math.random() * (this.height - 1))
            }
            console.log('spawn food!', this.food);
        } while (this.food && this.snake.isCollidingWithSelf(this.food));
    },

    renderFood: function() {
        this.context.fillRect(this.food.x * this.block_size, this.food.y * this.block_size, this.block_size, this.block_size);
    },

    isCollidingWithFood: function(next) {
        if (next.x == this.food.x && next.y == this.food.y) {
            return true;
        }

        return false;
    },

    bindKeys: function() {
        Mousetrap.bind('up', this.onUpKeyPress.bind(this));
        Mousetrap.bind('down', this.onDownKeyPress.bind(this));
        Mousetrap.bind('right', this.onRightKeyPress.bind(this));
        Mousetrap.bind('left', this.onLeftKeyPress.bind(this));
        Mousetrap.bind('esc', this.onPause.bind(this));
    },

    getNextPosition: function() {
        var dir = this.snake.getDirection(),
            head = this.snake.getHead(),
            next;

        switch (dir) {
        case Snake.DIR.NORTH:
            next = {
                x: head.x,
                y: head.y-1
            };
            break;
        case Snake.DIR.SOUTH:
            next = {
                x: head.x,
                y: head.y+1
            };
            break;
        case Snake.DIR.EAST:
            next = {
                x: head.x+1,
                y: head.y
            };
            break;
        case Snake.DIR.WEST:
            next = {
                x: head.x-1,
                y: head.y
            };
            break;
        }

        return next;
    },

    onUpKeyPress: function(e) {
        if (this.snake.getDirection() !== Snake.DIR.SOUTH) {
            this.snake.setDirection(Snake.DIR.NORTH);
        }
    },

    onDownKeyPress: function(e) {
        if (this.snake.getDirection() !== Snake.DIR.NORTH) {
            this.snake.setDirection(Snake.DIR.SOUTH);
        }
    },
    
    onLeftKeyPress: function(e) {
        if (this.snake.getDirection() !== Snake.DIR.EAST) {
           this.snake.setDirection(Snake.DIR.WEST);
       }
    },
    
    onRightKeyPress: function(e) {
        if (this.snake.getDirection() !== Snake.DIR.WEST) {
            this.snake.setDirection(Snake.DIR.EAST);
        }
    },

    onPause: function() {
        this.paused = !this.paused;
        console.log(this.paused)
    },

    updateScore: function() {
        this.score++;
        document.getElementById('score').innerHTML = this.score;
    },

    startGame: function(difficulty) {
        console.log(difficulty, ' and also bucky is not smart');

        switch (difficulty) {
        case 'easy': this.frames_to_skip = 10; break;
        case 'medium': this.frames_to_skip = 5; break;
        case 'hard': this.frames_to_skip = 0; break;
        }
        
        this.start_screen = false;
        this.update();
    }
});