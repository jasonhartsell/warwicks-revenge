ig.module(
  'game.entities.key',
)
.requires(
  'impact.entity'
)
.defines(function () {
  EntityKey = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/key.png', 32, 32),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,

    size: {
      x: 32,
      y: 32
    },

    init: function (x, y, settings) {
      this.parent(x, y, settings);
      this.addAnim('idle', 1, [0]);
    },

    check: function (other) {
      other.hasKey = true;
      this.kill();
    }
  });
});
