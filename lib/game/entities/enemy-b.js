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
        speed: 80,
        health: 300,
        maxVel: {
            x: 65,
            y: 65
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
                ig.game.spawnEntity(EntitySpores, this.pos.x + 12, this.pos.y - this.size.y, {
                    checkAgainst: ig.Entity.TYPE.A,
                    particles: 25,
                    totalColors: 10
                });
                this.idleTimer.reset();
            }
        },

        update: function() {  
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            var distanceToPlayer = player ? this.distanceTo(player) : 0;

            if (player && (distanceToPlayer < 300)) {
                if (player.pos.x < this.pos.x) {
                    this.vel.x = -this.speed - (player.size.x * 2);
                    this.flip = false;
                } else if (player.pos.x > this.pos.x) {
                    this.vel.x = this.speed + (player.size.x * 2);
                    this.flip = true;
                }

                if (player.pos.y < this.pos.y) {
                    this.vel.y = -this.speed - (player.size.y * 2);
                } else if (player.pos.y > this.pos.y) {
                    this.vel.y = this.speed + (player.size.y * 2);
                }
            }

            if (player && (distanceToPlayer < 100)) {
                this.shoot();
            }

            this.currentAnim.flip.x = this.flip;
            this.parent();
        },

        kill: function() {
            this.parent();
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
                colorOffset: 1,
                particles: 25,
                totalColors: 7
            });
        }
    });

    EntitySpores = EntityParticle.extend({
        lifetime: 1,

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            for (var i = 0; i < settings.particles; i++) {
                ig.game.spawnEntity(EntityParticle, x, y, {
                    animSheet: new ig.AnimationSheet('media/spores.png', 2, 2),
                    checkAgainst: settings.checkAgainst ? settings.checkAgainst : ig.Entity.TYPE.NONE,
                    collides: ig.Entity.COLLIDES.PASSIVE,
                    colorOffset: settings.colorOffset ? settings.colorOffset : 0,
                    fadetime: 1,
                    lifetime: 1,
                    size: {
                        x: 2,
                        y: 2
                    },
                    totalColors: settings.totalColors ? settings.totalColors : 0,
                    vel: {
                        x: 20,
                        y: 35
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
