/*!
 * main.js
 *
 */
 
;(function ($, window, undefined) {
	$(document).ready(function(){
		var Parallax;
		var DEFAULT_OPTIONS;
		var jarallax = new Jarallax(new ControllerScroll(true));

		/**
		 * DEFAULT_OPTIONS
		 */
		DEFAULT_OPTIONS = {
			animation: 'fade'
			,animationStart: 0.5 // {number} - 1:画面の高さが残り100%でanimation start, 0.5:残り50%でanimation start.
			,animationEnd: 0.4 // {number} - 0:画面の高さが残り0%でanimation end, 0.3:残り30%でanimation end.
			,elmPosTop: false
		}

		/*
		 * Parallax
		 */
		var Parallax = function (elm, options) {
			var self = this;
			self.o = $.extend({}, DEFAULT_OPTIONS, options);

			self.$elm = $(elm);
			// elmのposition top位置を取得
			self.elmPosTop = (self.o.elmPosTop) ? self.o.elmPosTop: self.$elm.offset().top;
			self.documentH = $(document).height();
			self.windowH = $(window).height();
			self.startPosTop = self.elmPosTop - (self.windowH * self.o.animationStart);
			self.endPosTop = self.elmPosTop - (self.windowH * self.o.animationEnd);
			self.startPercent = self.startPosTop / (self.documentH - self.windowH) * 100;
			self.endPercent = (function () {
				var endPercent = self.endPosTop / (self.documentH - self.windowH) * 100;
				return (endPercent > 100) ? 100: endPercent;
			})();

			self._init();
		}

		Parallax.prototype._init = function () {
			var self = this;
			self._refresh();
			self._draw();
			self._jarallax();
			self._eventify();
		}

		Parallax.prototype._eventify = function () {
			var self = this;

			$(window).on('scroll', function () {
				self._refresh();
				self._draw();
			});
		}

		Parallax.prototype._refresh = function () {
			var self = this;
			// 現在のスクロールtop位置を取得
			self.scrollPosTop = $(document).scrollTop();
			self.scrollPercent = self.scrollPosTop / (self.documentH - self.windowH) * 100;
		}

		// 表示
		Parallax.prototype._draw = function () {
			var self = this;
			$('.scrollParamArea .scroll').text('scrollPosTop: ' + self.scrollPosTop);
			$('.scrollParamArea .top').text('elmPosTop: ' + self.elmPosTop);
			$('.scrollParamArea .documentH').text('documentH: ' + self.documentH);
			$('.scrollParamArea .windowH').text('windowH: ' + self.windowH);
			$('.scrollParamArea .documentH_windowH').text('documentH - windowH: ' +  (self.documentH - self.windowH));
			$('.scrollParamArea .scrollPercent').text('scrollPercent: ' + self.scrollPercent.toFixed(0));
			$('.scrollParamArea .startPosTop').text('startPosTop: ' + self.startPosTop);
			$('.scrollParamArea .endPosTop').text('endPosTop: ' + self.endPosTop);
			$('.scrollParamArea .startPercent').text('startPercent: ' + self.startPercent.toFixed(0));
			$('.scrollParamArea .endPercent').text('endPercent: ' + self.endPercent.toFixed(0));
		}

		Parallax.prototype._jarallax = function () {
			var self = this;

			switch (self.o.animation) {
				case 'fade':
					jarallax.addAnimation(self.$elm,[
						{progress:'0%', opacity:'0'},
						{progress: self.startPercent+'%', opacity:'0'},
						{progress: self.endPercent+'%', opacity:'1'},
						{progress:'100%', opacity:'1'}
					]);
					break;

				case 'rightToLeft':
					jarallax.addAnimation(self.$elm,[
						{progress:'0%', opacity:'0', left: '50px'},
						{progress: self.startPercent+'%', opacity:'0', left: '50px'},
						{progress: self.endPercent+'%', opacity:'1', left: '0px'},
						{progress:'100%', opacity:'1', left: '0px'}
					]);
					break;

				case 'bottomToTop':
					jarallax.addAnimation(self.$elm,[
						{progress:'0%', opacity:'0', top: '50px'},
						{progress: self.startPercent+'%', opacity:'0', top: '50px'},
						{progress: self.endPercent+'%', opacity:'1', top: '0px'},
						{progress:'100%', opacity:'1', top: '0px'}
					]);
					break;

				default:
					break;
			}
		}



		$('.p').each(function () {
			new Parallax(this, {
				animation: 'rightToLeft'
			});
		});

//		$('.box').each(function () {
//			new Parallax(this, {
//				animation: 'rightToLeft'
//			});
//		});


		var $group = $('.box');
		var baseElmPosTop = $group.eq(0).offset().top;
		var addNum = 50;

		$group.each(function () {
			var self = this;

			_action();
			_calc();


			function _action() {
				new Parallax(self, {
					animation: 'rightToLeft'
					,elmPosTop: baseElmPosTop
				});
			}

			function _calc() {
				baseElmPosTop += addNum;
			}

		});
		
		


	});
})(jQuery, this);
