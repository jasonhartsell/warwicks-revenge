ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.entities.health',
	'game.entities.player',

	'game.levels.level-1',
	'game.levels.level-2'
)
.defines(function() {
	MyGame = ig.Game.extend({	
		// Load a font
		font: new ig.Font( 'media/font.png' ),

		score: 0,

		themeSong: new ig.Sound('media/sounds/theme.mp3'),

		init: function() {
			ig.input.bind(ig.KEY.UP_ARROW, 'up');
			ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
			ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
			ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
			ig.input.bind(ig.KEY.SPACE, 'shoot');

			this.loadLevel(LevelLevel1);

			this.themeSong._loop = true;
			this.themeSong.play();
		},
		
		draw: function() {
			this.parent();
			this.font.draw('SCORE: ' + ig.game.score, 15, 60, ig.Font.ALIGN.LEFT);
		},

		loadLevel: function (level) {
			this.currentLevel = level;
			this.parent(level);
		},
		
		update: function() {
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
		font: new ig.Font( 'media/font.png' ),
		title: new ig.Image('media/title.png'),
		background: new ig.Image('media/splash-screen-bg.png'),
		mainCharacter: new ig.Image('media/splash-screen-main-character.png'),

		init: function() {
			ig.input.bind(ig.KEY.SPACE, 'shoot');
		},

		update: function() {
			if (ig.input.pressed('shoot')) {
				ig.system.setGame(MyGame);
			}
			this.parent();
		},

		draw: function() {
			this.parent();
			this.background.draw(0,0);
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

		init: function () {
			ig.input.bind(ig.KEY.SPACE, 'shoot');
		},

		update: function () {
			if (ig.input.pressed('shoot')) {
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
				
			this.font.draw('Final Score: ' + localStorage.getItem('score'), x, y + 115, ig.Font.ALIGN.CENTER);
			this.font.draw('SPACEBAR: To Replay', x, y + 140, ig.Font.ALIGN.CENTER);
		}
	});

	// Start the Game with 60fps, a resolution of 320x240, scaled
	// up by a factor of 2
	ig.main('#canvas', StartScreen, 60, 640, 480, 1);
});
