ig.module(
    'game.entities.player',
)
.requires(
    'impact.entity',
    'impact.entity-pool',
    'game.entities.particle'
)
.defines(function () {
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/sprites/player.png', 64, 64),

        size: {
            x: 48,
            y: 56
        },
        offset: {
            x: 8,
            y: 4
        },
        flip: false,
        speed: 1200,
        maxVel: {
            x: 175,
            y: 175
        },
        health: 100,
        startPosition: null,

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        keyStack: [],
        lastKey: '',

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.startPosition = {
                x: x,
                y: y
            };
            this.lastKey = 'right';

            this.addAnim('idle', 0.2, [3, 5, 5, 5, 5, 5, 5, 5, 3]);
            this.addAnim('upIdle', 0.2, [0, 2, 2, 2, 0]);
            this.addAnim('downIdle', 0.2, [6, 7, 7, 7, 6]);

            this.addAnim('shoot', 0.05, [4, 5, 3]);
            this.addAnim('upShoot', 0.05, [2, 0, 1]);
            this.addAnim('downShoot', 0.05, [8, 6, 7]);
        },

        reset: function () {
            this.parent(x, y, settings);
            this.startPosition = {
                x: x,
                y: y
            };
            this.lastKey = 'right';
            this.update();
        },

        check: function () {
            this.receiveDamage(1);
        },

        kill: function () {
            this.parent();
            var x = this.startPosition.x;
            var y = this.startPosition.y;

            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
                particles: 25,
                totalColors: 7,
                callBack: function() {
                    ig.game.spawnEntity(EntityPlayer, x, y);
                    // Reset the level
                    ig.game.loadLevelDeferred(ig.game.currentLevel);
                }
            });
        },

        shoot: function (anim, flip, facing) {
            if (ig.input.pressed('shoot')) {
                if (!facing) {
                    facing = this.lastKey;

                    if (facing === 'up' || facing === 'down') {
                        anim = facing + 'Shoot';
                    } else {
                        anim = 'shoot';
                    }
                }

                this.currentAnim = this.anims[anim];

                ig.game.spawnEntity(EntityArrow, this.pos.x, this.pos.y, {
                    flip: flip,
                    facing: facing
                });
            }
        },

        update: function () {
            for (var i = this.keyStack.length; i--;) {
                if (!ig.input.state(this.keyStack[i])) {
                    this.keyStack.splice(i, 1);
                }
            }

            if (ig.input.pressed('up')) {
                this.keyStack.push('up');
            }
            if (ig.input.pressed('down')) {
                this.keyStack.push('down');
            }
            if (ig.input.pressed('left')) {
                this.keyStack.push('left');
            }
            if (ig.input.pressed('right')) {
                this.keyStack.push('right');
            }

            // get the key from the top of the stack
            var lastKey = this.keyStack[this.keyStack.length - 1];
            if (lastKey === 'up') {
                this.vel.y = -this.speed;
                this.lastKey = 'up';
                this.currentAnim = this.anims.upIdle;
                this.shoot('upShoot', this.flip, 'up');
            } else if (lastKey === 'down') {
                this.vel.y = this.speed;
                this.lastKey = 'down';
                this.currentAnim = this.anims.downIdle;
                this.shoot('downShoot', this.flip, 'down');
            } else if (lastKey === 'left') {
                this.vel.x = -this.speed;
                this.flip = true;
                this.lastKey = 'left';
                this.currentAnim = this.anims.idle;
                this.shoot('shoot', this.flip, 'left');
            } else if (lastKey === 'right') {
                this.vel.x = this.speed
                this.flip = false;
                this.lastKey = 'right';
                this.currentAnim = this.anims.idle;
                this.shoot('shoot', this.flip, 'right');
            } else {
                this.vel.x = 0;
                this.vel.y = 0;

                if (!ig.input.state('shoot')) {
                    if (this.lastKey === 'up') {
                        this.currentAnim = this.anims.upIdle;
                    }

                    if (this.lastKey === 'down') {
                        this.currentAnim = this.anims.downIdle;
                    }

                    if (this.lastKey === 'left' || this.lastKey === 'right') {
                        this.currentAnim = this.anims.idle;
                    }
                }
            }

            this.shoot('shoot', this.flip, null);

            this.currentAnim.flip.x = this.flip;
            this.parent();
        }
    });

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
            } else if (this.facing === 'left' || this.facing === 'right') {
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
