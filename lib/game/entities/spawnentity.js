ig.module(
  'game.entities.spawnentity'
)
.requires(
  'impact.game',
  'impact.entity',
  'game.entities.enemy-a',
  'game.entities.enemy-b',
  'game.entities.enemy-c'
)
.defines(function () {
  EntitySpawnentity = ig.Entity.extend({
    _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
    _wmDrawBox: true,

    cols: 0,
    rows: 0,

    offset: {
      x: 0,
      y: 0
    },
    pad: {
      x: null,
      y: null
    },
    scale: null,
    size: {
      x: 64,
      y: 64
    },
    spawn: null,
    trigger: 0,

    triggeredBy: function (entity, trigger) {
      if (this.scale) {
        this.size.x = this.size.x * this.scale;
        this.size.y = this.size.y * this.scale;
      }

      if (this.spawn) {
        // Spawn enemies in rows / columns
        // Based on tile size
        var columns = this.cols;
        var rows = this.rows;
        var total = columns * rows;
        var paddingX = this.pad.x || 5;
        var paddingY = this.pad.y || 5;

        var column = 0;
        var row = 0;
        var startX = this.pos.x + this.offset.x;
        var startY = this.pos.y + this.offset.y;

        var mapWidth = ig.game.backgroundMaps[0].pxWidth;
        var mapHeight = ig.game.backgroundMaps[0].pxHeight;

        for (var i = 0; i < total; i++) {
          var x = startX + ((this.size.x * 0.5) + paddingX) * column;
          var y = startY + ((this.size.y * 0.5) + paddingY) * row;

          column++;

          if (x < 0) {
            x = (this.size.x * 0.5) * column;
          } else if (x >= mapWidth) {
            x = mapWidth - (this.size.x * 0.5 + paddingX) * column;
          }

          if (y < 0) {
            y = (this.size.y * 0.5) * column;
          } else if (y >= mapHeight) {
            y = mapHeight - (this.size.y * 0.5 + paddingY) * column;
          }

          ig.game.spawnEntity('Entity' + this.spawn, x, y);

          if (column >= columns) {
            row++;
            column = 0;
          }
        }
      }
    }
  });
});
