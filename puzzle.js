/**
 * @author Marco Behnke <marco@behnke.biz>
 */
(function(jQuery) {

	function arrayShuffle() {
		var tmp, rand;
		for ( var i = 0; i < this.length; i++) {
			rand = Math.floor(Math.random() * this.length);
			tmp = this[i];
			this[i] = this[rand];
			this[rand] = tmp;
		}
	}

	Array.prototype.shuffle = arrayShuffle;

	var puzzleGame = {

		/**
		 * allowed moving directions for tiles
		 *
		 * @var Object
		 */
		freeMappings : {
			1 : [ 2, 4 ],
			2 : [ 1, 3, 5 ],
			3 : [ 2, 6 ],
			4 : [ 1, 5, 7 ],
			5 : [ 2, 4, 6, 8 ],
			6 : [ 3, 5, 9 ],
			7 : [ 4, 8 ],
			8 : [ 5, 7, 9 ],
			9 : [ 6, 8 ]
		},

		/**
		 * all background position classes
		 * if tiles have this order, the game is won
		 *
		 * @var Array
		 */
		positions : [ 'topleft', 'topcenter', 'topright',
			'centerleft', 'centercenter', 'centerright',
			'bottomleft', 'bottomcenter', 'bottomright'
		],

		/**
		 * default position for empty tile
		 * is randomized during start
		 *
		 * @var integer
		 */
		emptyPosition : 5,

		/**
		 * if true, click binding is ignored
		 *
		 * @var boolean
		 */
		locked : false,

		/**
		 * callback function to check winning status
		 */
		wins : function wins() {
			var winner = true;
			jQuery.each(puzzleGame.positions, function(k, v) {
				v = v.replace(' ', '.');
				winner = winner && (k + 1 == parseInt(jQuery('#container .tile.' + v).attr('position'), 10));
			});

			if (winner) {
				jQuery('#container .tile.empty').removeClass('empty');
			} else {
				puzzleGame.locked = false;
			}
		},

		/**
		 * reset all defaults, remove all tiles
		 */
		reset : function reset() {
			puzzleGame.locked = false;
			jQuery('#container .tile').remove();
		},

		/**
		 * start game, shuffle and place tiles on grid, init events
		 */
		start : function start() {
			puzzleGame.emptyPosition = Math.ceil((Math.random() * 8) + 1);
			jQuery('#clicks').text(0);
			puzzleGame.positions.shuffle();
			puzzleGame.disorderTiles();
			puzzleGame.initEvents();
		},

		/**
		 * @uses puzzleGame.reset()
		 * @uses puzzleGame.start()
		 */
		restart : function restart() {
			puzzleGame.reset();
			puzzleGame.start();
		},

		/**
		 * place tiles on grid
		 */
		disorderTiles : function disorderTiles() {
			var i = 1;
			jQuery('#container .cell').each(function() {
				var position = jQuery(this).position();
				jQuery('<div class="tile"></div>').appendTo('#container')
					.css('top', position.top)
					.css('left', position.left)
					.addClass(puzzleGame.positions[9 - i])
					.attr('position', i++)
					.addClass((i == puzzleGame.emptyPosition) ? 'empty' : '');
			});
		},

		/**
		 * bind click events
		 */
		initEvents : function initEvents() {
			jQuery('#container .tile:not(.empty)').click(function() {
				if (puzzleGame.locked) {
					return;
				}

				puzzleGame.locked = true;
				var oldPosition = parseInt(jQuery(this).attr('position'), 10);
				var oldLeft = jQuery(this).position().left;
				var oldTop = jQuery(this).position().top;
				var valids = puzzleGame.freeMappings[oldPosition];
				var target = null;

				jQuery.each(valids, function(k, v) {
					if (jQuery('#container .tile[position="' + v + '"]').hasClass('empty')) {
						target = jQuery('#container .tile[position="' + v + '"]');
					}
				});

				if (target != null) {

					jQuery('#clicks').text(parseInt(jQuery('#clicks').text(), 10) + 1);

					var newPosition = jQuery(target).attr('position');
					var newLeft = jQuery(target).position().left;
					var newTop = jQuery(target).position().top;

					jQuery(this).attr('position', newPosition).animate({
						top : newTop + 'px',
						left : newLeft + 'px'
					}, 250, 'swing', puzzleGame.wins);

					jQuery(target).attr('position', oldPosition).animate({
						top : oldTop + 'px',
						left : oldLeft + 'px'
					}, 250, 'swing');

				} else {
					puzzleGame.locked = false;
				}
			});

		}
	};

	var moreImages = [
		'cars2.jpg',
		'facebook.png',
		'http://3ost.ru/uploads/posts/2010-05/1274473331_south-park-bigger-longer-uncut-complete-score.jpg',
		'http://images.community.wizards.com/community.wizards.com/user/dragonlance/595189a911e71c4376e4972a9822d8bc.jpg?v=202500',
		'http://r21.imgfast.net/users/2111/14/34/03/album/nature20.jpg',
		'http://media-cdn.tripadvisor.com/media/photo-s/01/c4/24/50/hotel-long-beach.jpg'
	];

	jQuery(function() {
		puzzleGame.start();

		jQuery('#submiturl').click(function() {
			var src = jQuery('#imgurl').val();
			puzzleGame.restart();
			jQuery('#container .tile').css('background-image', 'url("' + src + '")');
		});

		jQuery.each(moreImages, function(k, v) {
			jQuery('#selector').append('<img src="' + v + '" />');
		});

		jQuery('#selector img').click(function() {
			jQuery('#imgurl').val(jQuery(this).attr('src'));
			jQuery('#submiturl').click();
		});
	});
})(jQuery);
