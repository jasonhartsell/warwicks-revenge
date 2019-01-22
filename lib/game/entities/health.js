ig.module(
  'game.entities.health'
)
.requires(
  'impact.entity',
  'game.entities.player'
)
.defines(function () {
  EntityHealth = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/sprites/health.png', 250, 50),

    type: ig.Entity.TYPE.NONE,

    _wmIgnore: true,

    player: null,
    size: {
      x: 250,
      y: 50
    },

    init: function (x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('5', 1, [0]);
      this.addAnim('4', 1, [1]);
      this.addAnim('3', 1, [2]);
      this.addAnim('2', 1, [3]);
      this.addAnim('1', 1, [4]);
      this.addAnim('0', 1, [5]);

      this.player = ig.game.getEntitiesByType(EntityPlayer)[0];
    },

    draw: function () {
      this.parent();
    },

    update: function () {
      var player = this.player;
      if (player) {
        var health = player.health;
        if (health < 100) {
          this.currentAnim = this.anims['5'];
        }

        if (health <= 80) {
          this.currentAnim = this.anims['4'];
        }

        if (health <= 60) {
          this.currentAnim = this.anims['3'];
        }

        if (health <= 40) {
          this.currentAnim = this.anims['2'];
        }

        if (health <= 20) {
          this.currentAnim = this.anims['1'];
        }

        if (health === 0) {
          this.currentAnim = this.anims['0'];
        }

        this.pos.x = (player.pos.x + 15) - (ig.system.width / 2);
        this.pos.y = (player.pos.y + 5) - (ig.system.height / 2);
      }

      this.parent();
    }
  });
});
