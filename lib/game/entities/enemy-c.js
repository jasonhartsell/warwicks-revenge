ig.module(
    'game.entities.enemy-c'
)
.requires(
    'impact.entity',
    'game.entities.particle'
) 
.defines(function() {
    EntityEnemyC = ig.Entity.extend({
        size: {x: 80, y: 80},
        flip: false,
        speed: 80,
        health: 400,

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,

        animSheet: new ig.AnimationSheet('media/sprites/enemy-c.png', 80, 80),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.25, [0,0,0,1,1,1,0,0,0,2,2,2,0,0,0]);

            this.idleTimer = new ig.Timer();
        },

        shoot: function (flip) {
            if (this.idleTimer.delta() > 1) { 
                ig.game.spawnEntity(EntityLazer, this.pos.x, this.pos.y, {
                    flip: flip
                });
                this.idleTimer.reset();
            }
        },

        update: function() {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            var distanceToPlayer = player ? this.distanceTo(player) : 0;

            if (player && (distanceToPlayer < 300)) {
                if (player.pos.x < this.pos.x) {
                    this.vel.x = -this.speed - (player.size.x);
                    this.flip = true;
                } else if (player.pos.x > this.pos.x) {
                    this.vel.x = this.speed + (player.size.x);
                    this.flip = false;
                }

                if (player.pos.y < this.pos.y) {
                    this.vel.y = -this.speed - (player.size.y);
                } else if (player.pos.y > this.pos.y) {
                    this.vel.y = this.speed + (player.size.y);
                }

                this.shoot(this.flip);
            }

            this.currentAnim.flip.x = this.flip;
            this.parent();
        }
    });

    EntityLazer = ig.Entity.extend({
        lifetime: 1,
        fadetime: 1,
        size: {
            x: 64,
            y: 64
        },
        maxVel: {
            x: 200,
            y: 0
        },

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,

        animSheet: new ig.AnimationSheet('media/lazer.png', 32, 4),

        init: function (x, y, settings) {
            this.parent(x, y, settings);

            this.vel.x = settings.flip ? -this.maxVel.x : this.maxVel.x;
            this.offset.y = -14;
            this.flip = settings.flip;

            this.addAnim('idle', 1, [0]);

            this.idleTimer = new ig.Timer();
        },

        check: function (other) {
            other.receiveDamage(1);

            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
                colorOffset: 1,
                offset: {
                    x: -50,
                    y: -40
                },
                particles: 2,
                totalColors: 7,
                vel: {
                    x: 10,
                    y: 40
                }
            });
        },

        update: function () {
            if (this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }

            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime,
                this.lifetime, 1, 0
            );

            if (this.flip) {
                this.offset.x = -10;
            } else {
                this.offset.x = -40;
            }

            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            if (player) {
                var aboveLazer  = (this.pos.y < player.pos.y);

                var lazerOffset = (aboveLazer) ?
                    -(this.pos.y - player.pos.y) :
                    (this.pos.y + player.pos.y);
                
                if (this.idleTimer.delta() < lazerOffset) {
                    if (aboveLazer) {
                        this.offset.y -= this.idleTimer.delta() + 0.25;
                    } else {
                        this.offset.y += this.idleTimer.delta() + 0.25;
                    }
                }
            }

            this.currentAnim.flip.x = this.flip;
            this.parent();
        }
    });
});
