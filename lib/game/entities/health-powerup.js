ig.module(
  'game.entities.health-powerup'
)
.requires(
  'impact.entity'
)
.defines(function () {
  EntityHealthPowerup = ig.Entity.extend({
    animSheet: new ig.AnimationSheet('media/health-potion.png', 32, 32),
    sound: new ig.Sound('media/sounds/health.mp3'),

    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,

    size: {
      x: 32,
      y: 32
    },
    standing: true,

    init: function (x, y, settings) {
      this.parent(x, y, settings);

      this.addAnim('idle', 1, [0]);

      this.sound.volume = 0.75;
    },

    check: function (other) {
      ig.game.score += 5;

      other.receiveDamage(-20);
      this.kill();
      this.sound.play();
    }
  });
});
