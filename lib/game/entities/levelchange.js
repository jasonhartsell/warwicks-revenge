ig.module(
  'game.entities.levelchange'
)
.requires(
  'impact.game',
  'impact.entity'
)
.defines(function () {
  EntityLevelchange = ig.Entity.extend({
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
    _wmDrawBox: true,

    size: {
      x: 64,
      y: 64
    },
    level: null,

    triggeredBy: function (entity, trigger) {
      // Stop playing all level songs
      var songs = ig.game.songs;
      for (var i = 0; i < songs.length; i++) {
        songs[i].stop();
      }
      
      if (this.level !== 'EndGame') {
        var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function (m, l, a, b) {
          return a.toUpperCase() + b;
        });

        ig.game.loadLevelDeferred(ig.global['Level' + levelName]);

        // Play level song
        songs[levelName].volume = 0.25;
        songs[levelName]._loop = true;
        songs[levelName].play();
      } else {
        localStorage.setItem('score', ig.game.score);
        ig.system.setGame(EndGame);
      }
    },

    update: function () {}
  });
});
