ig.module(
    'game.entities.health-powerup'
)
.requires(
    'impact.entity'
) 
.defines(function() {
    EntityHealthPowerup = ig.Entity.extend({
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        size: {x: 32, y: 32},
        standing: true,
        animSheet: new ig.AnimationSheet('media/ruby.png', 32, 32),

        sound: new ig.Sound('media/sounds/health.mp3'),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        },
     
        check: function(other) {
            other.receiveDamage(-20);
            this.sound.play();
            this.kill();
            ig.game.score += 5;
        },

        draw: function() {    
            this.parent();
        },

        update: function () {
            this.parent();
        }
    });

});
