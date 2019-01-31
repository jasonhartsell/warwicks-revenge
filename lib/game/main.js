ig.module(
  'game.main'
)
.requires(
  'impact.game',
  'impact.font',

  'game.entities.health',
  'game.entities.player',

  'game.levels.1',
  'game.levels.2',
  'game.levels.3'
)
.defines(function () {
  MyGame = ig.Game.extend({
    // Load a font
    font: new ig.Font('media/font.png'),

    attackDistance: Math.floor(Math.random() * (450 - 100 + 1) + 350),
    lives: 3,
    score: 0,

    songs: [
      new ig.Sound('media/sounds/menu.mp3'),
      new ig.Sound('media/sounds/theme1.mp3'),
      new ig.Sound('media/sounds/theme2.mp3'),
      new ig.Sound('media/sounds/theme3.mp3')
    ],

    init: function () {
      ig.input.bind(ig.KEY.UP_ARROW, 'up');
      ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
      ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
      ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
      ig.input.bind(ig.KEY.SPACE, 'shoot');

      this.loadLevel(Level1);
      this.songs[0].stop();
      this.songs[1].volume = 0.25;
      this.songs[1]._loop = true;
      this.songs[1].play();

      localStorage.setItem('lives', this.lives);
      localStorage.setItem('score', this.score);
    },

    draw: function () {
      this.parent();
      this.font.draw('LIVES: ' + ig.game.lives, 25, 60, ig.Font.ALIGN.LEFT);
      this.font.draw('SCORE: ' + ig.game.score, 25, 85, ig.Font.ALIGN.LEFT);
    },

    loadLevel: function (level) {
      this.currentLevel = level;
      this.parent(level);
    },

    update: function () {
      this.parent();

      // screen follows the player
      var player = this.getEntitiesByType(EntityPlayer)[0];
      if (player) {
        this.screen.x = player.pos.x - ig.system.width / 2;
        this.screen.y = player.pos.y - ig.system.height / 2;

        this.spawnEntity(EntityHealth);
      }
    }
  });

  StartScreen = ig.Game.extend({
    font: new ig.Font('media/font.png'),
    title: new ig.Image('media/title.png'),
    background: new ig.Image('media/splash-screen-bg.png'),
    mainCharacter: new ig.Image('media/splash-screen-main-character.png'),

    menuSong: new ig.Sound('media/sounds/menu.mp3'),

    init: function () {
      ig.input.bind(ig.KEY.SPACE, 'shoot');

      this.menuSong.volume = 0.35;
      this.menuSong._loop = true;
      this.menuSong.play();
    },

    update: function () {
      if (ig.input.pressed('shoot')) {
        this.menuSong.stop();
        ig.system.setGame(MyGame);
      }
      this.parent();
    },

    draw: function () {
      this.parent();
      this.background.draw(0, 0);
      var x = ig.system.width / 2,
        y = ig.system.height / 2;

      this.title.draw(x - 218, 75);
      this.mainCharacter.draw(x - 60, 150);

      this.font.draw('SPACEBAR: To Start and Shoot', x, y + 115, ig.Font.ALIGN.CENTER);
      this.font.draw('LEFT, RIGHT, UP, DOWN: To move', x, y + 140, ig.Font.ALIGN.CENTER);
    }
  });

  EndGame = ig.Game.extend({
    font: new ig.Font('media/font.png'),
    title: new ig.Image('media/title.png'),
    background: new ig.Image('media/splash-screen-bg.png'),
    mainCharacter: new ig.Image('media/splash-screen-main-character.png'),

    menuSong: new ig.Sound('media/sounds/menu.mp3'),

    init: function () {
      ig.input.bind(ig.KEY.SPACE, 'shoot');

      this.menuSong.volume = 0.35;
      this.menuSong._loop = true;
      this.menuSong.play();
    },

    update: function () {
      if (ig.input.pressed('shoot')) {
        this.menuSong.stop();
        ig.system.setGame(MyGame);
      }
      this.parent();
    },

    draw: function () {
      this.parent();
      this.background.draw(0, 0);
      var x = ig.system.width / 2,
        y = ig.system.height / 2;

      this.title.draw(x - 218, 75);
      this.mainCharacter.draw(x - 60, 150);

      if (localStorage.getItem('lives') === '0') {
        this.font.draw('GAME OVER: NO MORE LIVES', x, y + 100, ig.Font.ALIGN.CENTER);
      } else {
        this.font.draw('CONGRATS: YOU BEAT THE GAME', x, y + 100, ig.Font.ALIGN.CENTER);
      }
      this.font.draw('FINAL SCORE: ' + localStorage.getItem('score'), x, y + 135, ig.Font.ALIGN.CENTER);
      this.font.draw('SPACEBAR: To Replay', x, y + 155, ig.Font.ALIGN.CENTER);
    }
  });

  // Start the Game with 60fps, a resolution of 320x240, scaled
  // up by a factor of 2
  ig.main('#canvas', StartScreen, 60, 640, 480, 1);
});
