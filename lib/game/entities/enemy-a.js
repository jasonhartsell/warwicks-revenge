ig.module(
  'game.entities.enemy-a'
)
.requires(
  'impact.entity',
  'game.entities.particle'
)
.defines(function () {
  EntityEnemyA = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/sprites/enemy-a.png', 32, 32),

    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.ACTIVE,

    flip: false,
    health: 200,
    maxVel: {
      x: 100,
      y: 100
    },
    offset: {
      x: 4,
      y: 4
    },
    size: {
      x: 32,
      y: 32
    },
    speed: 100,

    init: function (x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim('idle', 0.15, [0, 1, 0, 1, 1, 1, 1, 1, 0, 0]);
    },

    kill: function () {
      this.parent();
      ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
        colorOffset: 1,
        particles: 25,
        totalColors: 7
      });
    },

    update: function () {
      var player = ig.game.getEntitiesByType(EntityPlayer)[0];
      var distanceToPlayer = player ? this.distanceTo(player) : 0;

      if (player && (distanceToPlayer < 450)) {
        if (player.pos.x < this.pos.x) {
          this.flip = false;
          this.vel.x = -this.speed;
        } else if (player.pos.x > this.pos.x) {
          this.flip = true;
          this.vel.x = this.speed;
        }

        if (player.pos.y < this.pos.y) {
          this.vel.y = -this.speed;
        } else if (player.pos.y > this.pos.y) {
          this.vel.y = this.speed;
        }
      }

      this.currentAnim.flip.x = this.flip;
      this.parent();
    }
  });
});
