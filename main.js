/*!
 * main.js
 *
 */

;(function ($, window, undefined) {
	'use strict';

	$(document).ready(function(){
		$('[data-easyParallax]').easyParallax();

		$('[data-easyParallax-group]').easyParallaxGroup();

		$('.p').easyParallax({
			animation: 'rightToLeft'
		});

		// callback sample - easyParallax animation完了後にcarouselをautoplay
		(function () {
			$('.ui-carousel').liquidCarousel({
				autoPlay:             false // {boolean} - true: autoplay
				,autoPlayHoverStop:    false // {boolean} - true: itemにマウスオーバー中はautoplayをストップ
				,autoPlayInterval:     1000 // {number} (milli second) - autoplayの間隔
			});

			var easyParallax = $('.ui-easyParallax-trigger').data('easyParallax');
			var carousel = $('.ui-carousel').data('carousel');
			var isMoved = false;
			easyParallax.$elm.on('easyParallaxEnd', function () {
				if (isMoved === false) {
					isMoved = true;
					carousel.autoPlay();
					carousel.moveBind(carousel.index + 1);
				}
			})
		})();
	});
})(jQuery, this);
