ig.module(
    'game.entities.enemy-b'
)
.requires(
    'impact.entity',
    'game.entities.particle'
) 
.defines(function() {
    EntityEnemyB = ig.Entity.extend({
        size: {x: 32, y: 32},
        offset: {x: 4, y: 4},
        flip: false,
        speed: 100,
        health: 300,
        maxVel: {
            x: 80,
            y: 80
        },

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/sprites/enemy-b.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.25, [0,0,0,1,1,1,0,0,0,2,2,2,0,0,0]);

            this.idleTimer = new ig.Timer();
        },

        shoot: function () {
            if (this.idleTimer.delta() > 2) { 
                ig.game.spawnEntity(EntitySpores, this.pos.x + 24, this.pos.y - (this.size.y / 2), {
                    checkAgainst: ig.Entity.TYPE.A,
                    particles: 75,
                    totalColors: 10
                });
                this.idleTimer.reset();
            }
        },

        update: function() {  
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            var distanceToPlayer = player ? this.distanceTo(player) : 0;

            if (player) {
                if (distanceToPlayer < 450) {
                    if (player.pos.x < this.pos.x) {
                        this.vel.x = -this.speed;
                        this.flip = false;
                    } else if (player.pos.x > this.pos.x) {
                        this.vel.x = this.speed;
                        this.flip = true;
                    }

                    if (player.pos.y < this.pos.y) {
                        this.vel.y = -this.speed;
                    } else if (player.pos.y > this.pos.y) {
                        this.vel.y = this.speed;
                    }
                }

                if (distanceToPlayer < 150) {
                    this.shoot();
                }
            }

            this.currentAnim.flip.x = this.flip;
            this.parent();
        },

        kill: function() {
            this.parent();
            ig.game.spawnEntity(EntitySpores, this.pos.x, this.pos.y, {
                checkAgainst: ig.Entity.TYPE.A,
                lifetime: 2,
                particles: 75,
                totalColors: 10,
                vel: {
                    x: 150,
                    y: 50
                }
            });
        }
    });

    EntitySpores = EntityParticle.extend({
        lifetime: 2,
        size: {
            x: 58,
            y: 48
        },

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            for (var i = 0; i < settings.particles; i++) {
                ig.game.spawnEntity(EntityParticle, x, y, {
                    animSheet: new ig.AnimationSheet('media/spores.png', 2, 2),
                    checkAgainst: settings.checkAgainst ? settings.checkAgainst : ig.Entity.TYPE.NONE,
                    collides: ig.Entity.COLLIDES.PASSIVE,
                    colorOffset: settings.colorOffset ? settings.colorOffset : 0,
                    fadetime: 1,
                    lifetime: settings.lifetime ? settings.lifetime : 0,
                    size: {
                        x: 2,
                        y: 2
                    },
                    totalColors: settings.totalColors ? settings.totalColors : 0,
                    vel: {
                        x: settings.vel && settings.vel.x ? settings.vel.x : 40,
                        y: settings.vel && settings.vel.y ? settings.vel.y : 35
                    }
                });
            }

            this.idleTimer = new ig.Timer();
        },

        check: function (other) {
            other.receiveDamage(1);
        },

        update: function () {
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }
        }
    });
});
