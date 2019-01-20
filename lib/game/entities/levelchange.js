ig.module(
    'game.entities.levelchange'
)
.requires(
    'impact.game',
    'impact.entity'
)
.defines(function () {
    EntityLevelchange = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',

        size: {
            x: 64,
            y: 64
        },
        level: null,

        triggeredBy: function (entity, trigger) {
            if (this.level !== 'EndGame') {
                var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function (m, l, a, b) {
                    return a.toUpperCase() + b;
                });

                ig.game.loadLevelDeferred(ig.global['Level' + levelName]);
            } else {
                localStorage.setItem('score', ig.game.score);
                ig.system.setGame(EndGame);
            }
        },

        update: function () {}
    });
});
