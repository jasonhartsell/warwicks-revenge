ig.module(
  'game.entities.enemy-b'
)
.requires(
  'impact.entity',
  'game.entities.particle'
)
.defines(function () {
  EntityEnemyB = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/sprites/enemy-b.png', 32, 32),
    killSound: new ig.Sound('media/sounds/death.mp3'),

    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.ACTIVE,

    canShoot: true,
    flip: false,
    health: 200,
    offset: {
      x: 4,
      y: 4
    },
    maxVel: {
      x: 80,
      y: 80
    },
    size: {
      x: 32,
      y: 32
    },
    speed: 100,

    init: function (x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim('idle', 0.25, [0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 0, 0, 0]).gotoRandomFrame();

      this.idleTimer = new ig.Timer();
      this.killSound.volume = 0.75;
      this.move = Math.random(Math.random() * 1 + 0.5);
    },

    handleMovementTrace: function (res) {
      this.canShoot = true;

      if (res.collision.x || res.collision.y) {
        this.vel.x = 0;
        this.vel.y = 0;
      }

      if (res.collision.y) {
        this.canShoot = false;
      }

      this.parent(res);
    },

    kill: function () {
      this.parent();
      this.killSound.play();
      ig.game.spawnEntity(EntitySpores, this.pos.x, this.pos.y, {
        checkAgainst: ig.Entity.TYPE.A,
        particles: 25,
        totalColors: 10,
        vel: {
          x: 80,
          y: 75
        }
      });
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

    update: function () {
      var player = ig.game.getEntitiesByType(EntityPlayer)[0];
      var distanceToPlayer = player ? this.distanceTo(player) : 0;

      if (player) {
        if (distanceToPlayer < ig.game.attackDistance) {
          if (player.pos.x < this.pos.x) {
            this.flip = false;
            this.vel.x = this.move * -this.speed;
          } else if (player.pos.x > this.pos.x) {
            this.flip = true;
            this.vel.x = this.move * this.speed;
          }

          if (player.pos.y < this.pos.y) {
            this.vel.y = this.move * -this.speed;
          } else if (player.pos.y > this.pos.y) {
            this.vel.y = this.move * this.speed;
          }
        }

        if (distanceToPlayer < 150 && this.canShoot) {
          this.shoot();
        }
      }

      this.currentAnim.flip.x = this.flip;
      this.parent();
    }
  });

  EntitySpores = EntityParticle.extend({
    lifetime: 1,
    size: {
      x: 58,
      y: 48
    },

    init: function (x, y, settings) {
      this.parent(x, y, settings);

      this.idleTimer = new ig.Timer();

      for (var i = 0; i < settings.particles; i++) {
        ig.game.spawnEntity(EntityParticle, x, y, {
          animSheet: new ig.AnimationSheet('media/spores.png', 2, 2),

          checkAgainst: settings.checkAgainst ? settings.checkAgainst : ig.Entity.TYPE.NONE,
          collides: ig.Entity.COLLIDES.NONE,

          colorOffset: settings.colorOffset ? settings.colorOffset : 0,
          damage: 0.15,
          fadetime: 1,
          lifetime: 1,
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
    },

    handleMovementTrace: function (res) {
      if (res.collision.x || res.collision.y) {
        this.kill();
      }

      this.parent(res);
    },

    update: function () {
      if (this.idleTimer.delta() > this.lifetime) {
        this.kill();
        return;
      }

      this.parent();
    }
  });
});
