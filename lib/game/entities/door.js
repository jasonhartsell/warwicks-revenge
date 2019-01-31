ig.module(
  'game.entities.door',
)
.requires(
  'impact.entity'
)
.defines(function () {
  EntityDoor = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/sprites/door.png', 32, 64),

    type: ig.Entity.TYPE.NONE,

    size: {
      x: 32,
      y: 64
    },

    init: function (x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim('idle', 1, [0]);
      this.addAnim('openDoor', 1, [1]);
    },

    update: function () {
      var player = ig.game.getEntitiesByType(EntityPlayer)[0];
      if (player && player.hasKey) {
        this.currentAnim = this.anims.openDoor;
      }
    }
  });
});
