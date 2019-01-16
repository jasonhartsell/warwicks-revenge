ig.module(
        'game.entities.arrow'
    )
    .requires(
        'impact.entity',
        'impact.entity-pool'
    )
    .defines(function () {
        EntityArrow = ig.Entity.extend({
            size: {
                x: 32,
                y: 32
            },
            animSheet: new ig.AnimationSheet('media/sprites/arrow.png', 32, 32),
            maxVel: {
                x: 200,
                y: 200
            },
            offset: {
                x: 0,
                y: 0
            },
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,

            sound: new ig.Sound('media/sounds/shoot.mp3'),
            killSound: new ig.Sound('media/sounds/death.mp3'),

            lifetime: 4,
            fadetime: 1,

            init: function (x, y, settings) {
                this.parent(x, y, settings);

                this.idleTimer = new ig.Timer();
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.facing = typeof settings.facing !== 'undefined' ? settings.facing : null;
                this.flip = settings.flip;

                this.sound.play();

                this.addAnim('idle', 1, [0]);
                this.addAnim('up', 1, [1]);
                this.addAnim('down', 1, [2]);
            },

            check: function (other) {
                other.receiveDamage(100);
                this.kill();
                this.killSound.play();
                ig.game.score += 20;
            },

            reset: function (x, y, settings) {
                this.parent(x, y, settings);

                this.idleTimer = new ig.Timer();
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.facing = typeof settings.facing !== 'undefined' ? settings.facing : null;
                this.flip = settings.flip;

                this.sound.play();
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
                
                if (this.facing === 'up') {
                    this.vel.x = 0;
                    this.offset.x = -15;
                    this.vel.y = -this.maxVel.y;
                    this.currentAnim = this.anims.up;
                } else if (this.facing === 'down') {
                    this.vel.x = 0;
                    this.offset.x = -15;
                    this.vel.y = this.maxVel.y;
                    this.currentAnim = this.anims.down;
                } else if (this.facing  === 'left' || this.facing === 'right') {
                    this.vel.y = 0;
                    this.offset.y = -10;
                    this.offset.x = 0;
                    this.currentAnim = this.anims.idle;
                }

                this.currentAnim.flip.x = this.flip;

                this.parent();
            }
        });

        ig.EntityPool.enableFor(EntityArrow);
    });