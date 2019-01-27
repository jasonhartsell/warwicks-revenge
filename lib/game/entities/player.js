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
    killSound: new ig.Sound('media/sounds/death.mp3'),

    type: ig.Entity.TYPE.A,
    checkAgainst: ig.Entity.TYPE.B,
    collides: ig.Entity.COLLIDES.PASSIVE,

    flip: false,
    health: 100,
    keyStack: [],
    lastKey: '',
    maxVel: {
      x: 175,
      y: 175
    },
    offset: {
      x: 8,
      y: 4
    },
    size: {
      x: 48,
      y: 56
    },
    speed: 1200,
    startPosition: null,

    init: function (x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim('idle', 0.2, [3, 5, 5, 5, 5, 5, 5, 5, 3]);
      this.addAnim('upIdle', 0.2, [0, 2, 2, 2, 0]);
      this.addAnim('downIdle', 0.2, [6, 7, 7, 7, 6]);

      this.addAnim('shoot', 0.05, [4, 5, 3]);
      this.addAnim('upShoot', 0.05, [2, 0, 1]);
      this.addAnim('downShoot', 0.05, [8, 6, 7]);

      this.lastKey = 'right';
      this.startPosition = {
        x: x,
        y: y
      };
    },

    check: function () {
      this.receiveDamage(1);
    },

    kill: function () {
      this.parent();

      ig.game.lives--;
      localStorage.setItem('lives', ig.game.lives);

      var startX = this.startPosition.x;
      var startY = this.startPosition.y;

      this.killSound.play();

      ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
        particles: 25,
        totalColors: 7,
        callBack: function () {
          ig.game.spawnEntity(EntityPlayer, startX, startY);
          // Reset the level
          ig.game.loadLevelDeferred(ig.game.currentLevel);
        }
      });

      if (ig.game.lives === 0) {
        localStorage.setItem('score', ig.game.score);
        localStorage.setItem('lives', 0);
        ig.system.setGame(EndGame);
      }
    },

    shoot: function (anim, flip, facing) {
      if (ig.input.released('shoot')) {
        if (!facing) {
          facing = this.lastKey;

          if (facing === 'up' || facing === 'down') {
            anim = facing + 'Shoot';
          } else {
            anim = 'shoot';
          }
        }

        this.currentAnim = this.anims[anim].rewind();

        ig.game.spawnEntity(EntityArrow, this.pos.x, this.pos.y, {
          facing: facing,
          flip: flip
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
        this.currentAnim = this.anims.upIdle;
        this.lastKey = 'up';
        this.vel.y = -this.speed;
        this.shoot('upShoot', this.flip, 'up');
      } else if (lastKey === 'down') {
        this.currentAnim = this.anims.downIdle;
        this.lastKey = 'down';
        this.vel.y = this.speed;
        this.shoot('downShoot', this.flip, 'down');
      } else if (lastKey === 'left') {
        this.currentAnim = this.anims.idle;
        this.flip = true;
        this.lastKey = 'left';
        this.vel.x = -this.speed;
        this.shoot('shoot', this.flip, 'left');
      } else if (lastKey === 'right') {
        this.currentAnim = this.anims.idle;
        this.flip = false;
        this.lastKey = 'right';
        this.vel.x = this.speed
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

      this.currentAnim.flip.x = this.flip;
      this.shoot('shoot', this.flip, null);
      this.parent();
    }
  });

  EntityArrow = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/sprites/arrow.png', 32, 32),
    sound: new ig.Sound('media/sounds/shoot.mp3'),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.B,

    maxVel: {
      x: 200,
      y: 200
    },
    offset: {
      x: 0,
      y: 0
    },
    size: {
      x: 32,
      y: 32
    },

    lifetime: 4,
    fadetime: 1,

    init: function (x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim('idle', 1, [0]);
      this.addAnim('up', 1, [1]);
      this.addAnim('down', 1, [2]);

      this.idleTimer = new ig.Timer();
      this.sound.play();

      this.facing = typeof settings.facing !== 'undefined' ? settings.facing : null;
      this.flip = settings.flip;
      this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
    },

    check: function (other) {
      ig.game.score += 20;

      other.receiveDamage(100);
      this.kill();
    },

    reset: function (x, y, settings) {
      this.parent(x, y, settings);

      this.idleTimer = new ig.Timer();
      this.sound.play();

      this.facing = typeof settings.facing !== 'undefined' ? settings.facing : null;
      this.flip = settings.flip;
      this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
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
        this.currentAnim = this.anims.up;
        this.offset.x = -15;
        this.vel.x = 0;
        this.vel.y = -this.maxVel.y;
      } else if (this.facing === 'down') {
        this.currentAnim = this.anims.down;
        this.offset.x = -15;
        this.vel.x = 0;
        this.vel.y = this.maxVel.y;
      } else if (this.facing === 'left' || this.facing === 'right') {
        this.currentAnim = this.anims.idle;
        this.offset.x = 0;
        this.offset.y = -10;
        this.vel.y = 0;
      }

      this.currentAnim.flip.x = this.flip;
      this.parent();
    }
  });

  ig.EntityPool.enableFor(EntityArrow);
});
