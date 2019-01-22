ig.module(
  'game.entities.particle'
)
.requires(
  'impact.entity'
)
.defines(function () {
  EntityParticle = ig.Entity.extend({
    type: ig.Entity.TYPE.NONE,

    _wmIgnore: true,

    init: function (x, y, settings) {
      this.parent(x, y, settings);

      this.idleTimer = new ig.Timer();

      if (this.animSheet) {
        var frameID = Math.round(Math.random() * this.totalColors) + (this.colorOffset * (this.totalColors + 1));

        this.addAnim('idle', 0.2, [frameID]);

        var vx = this.vel.x;
        var vy = this.vel.y;

        this.vel.x = (Math.random() * 2 - 1) * vx;
        this.vel.y = (Math.random() * 2 - 1) * vy;
      }
    },

    check: function (other) {
      if (this.damage) {
        other.receiveDamage(this.damage);
      }
    },

    update: function () {
      if (this.idleTimer.delta() > this.lifetime) {
        this.kill();
        return;
      }

      if (this.currentAnim) {
        this.currentAnim.alpha = this.idleTimer.delta().map(
          this.lifetime - this.fadetime, this.lifetime, 1, 0
        );
      }

      this.parent();
    }
  });

  EntityDeathExplosion = EntityParticle.extend({
    callBack: null,
    lifetime: 1,

    init: function (x, y, settings) {
      this.parent(x, y, settings);

      for (var i = 0; i < settings.particles; i++) {
        ig.game.spawnEntity(EntityParticle, x, y, {
          animSheet: new ig.AnimationSheet('media/blood.png', 2, 2),
          checkAgainst: settings.checkAgainst ? settings.checkAgainst : ig.Entity.TYPE.NONE,
          collides: ig.Entity.COLLIDES.LITE,
          colorOffset: settings.colorOffset ? settings.colorOffset : 0,
          fadetime: 1,
          lifetime: 2,
          offset: {
            x: settings.offset && settings.offset.x ? settings.offset.x : 0,
            y: settings.offset && settings.offset.y ? settings.offset.y : 0
          },
          totalColors: settings.totalColors ? settings.totalColors : 0,
          vel: {
            x: settings.vel && settings.vel.x ? settings.vel.x : 125,
            y: settings.vel && settings.vel.y ? settings.vel.y : 75
          }
        });
      }

      this.idleTimer = new ig.Timer();
    },
    update: function () {
      if (this.idleTimer.delta() > this.lifetime) {
        this.kill();
        if (this.callBack) {
          this.callBack();
        }
        return;
      }
    }
  });
});
