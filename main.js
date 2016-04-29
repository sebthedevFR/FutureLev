// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(800, 490, Phaser, 'gameDiv');
var s;
var music;


// Creates a new 'main' state that will contain the game
var mainState = {

    // Function called first to load all the assets
    preload: function() { 
        // Change the background color of the game
            //game.stage.backgroundColor = '#71c5cf';

        // Load the bird sprite
        game.load.image('bird', 'assets/ship.png');

        // Load the pipe sprite
        game.load.image('pipe', 'assets/brick2.png');

        game.load.image('space', 'assets/space2.jpg');

        game.load.audio('jump', 'assets/jump2.wav');

        game.load.audio('explo', 'assets/explo.wav'); 

        game.load.audio('music', 'assets/music.wav');    
    },

    // Fuction called after 'preload' to setup the game 
    create: function() { 

        music = game.add.audio('music')
        music.play();

        s = game.add.tileSprite(0, 0, 800, 600, 'space');


        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Display the bird on the screen
        this.bird = this.game.add.sprite(100, 245, 'bird');
        
        // Add gravity to the bird to make it fall
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 0;


        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 

        // Create a group of 20 pipes
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(50, 'pipe');  

        // Timer that calls 'addRowOfPipes' ever 1.5 seconds
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);           

        // Add a score label on the top left of the screen
        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

        this.bird.anchor.setTo(-0.2, 0.5);

        this.jumpSound = game.add.audio('jump');
        this.exploSound = game.add.audio('explo');
        this.musicSound = game.add.audio('music');

        


    },


    // This function is called 60 times per second
    update: function() {
        // If the bird is out of the world (too high or too low), call the 'restartGame' function
        if (this.bird.inWorld == false)
            this.restartGame(); 

        // If the bird overlap any pipes, call 'restartGame'
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);      

        // ANIMATIONS 

        if (this.bird.angle<20)
            this.bird.angle += 1;

        if (game.input.activePointer.isDown)
        {
            this.bird.body.gravity.y = 1000;

        }
    },

    hitPipe: function() {  
    


    // If the bird has already hit a pipe, we have nothing to do

    this.exploSound.play(); 
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEachAlive(function(p){
        p.body.velocity.x = 0;
    }, this);
},

    // Make the bird jump 
    jump: function() {

        if (this.bird.alive == false)  
        return; 
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -250;

        this.jumpSound.play();  

        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        // Set the animation to change the angle of the sprite to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start();  
    },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
        music.stop();
    },

    // Add a pipe on the screen
    addOnePipe: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstDead();

        // Set the new position of the pipe
        pipe.reset(x, y);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 
               
        // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    // Add a row of 6 pipes with a hole somewhere in the middle
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1) 
                this.addOnePipe(800, i*60+20);   
    
        this.score += 1;
        this.labelScore.text = this.score;
        i = 8;  
    },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main'); 
