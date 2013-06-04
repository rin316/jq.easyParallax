/*!
 * main.js
 *
 */
 
;(function ($, window, undefined) {
	$(document).ready(function(){
		var Parallax;
		var DEFAULT_OPTIONS;

		/**
		 * DEFAULT_OPTIONS
		 */
		DEFAULT_OPTIONS = {
			animationStart: 0.5 // {number} - 1:画面の高さが残り100%でanimation start, 0.5:残り50%でanimation start.
			,animationEnd: 0.3 // {number} - 0:画面の高さが残り0%でanimation end, 0.3:残り30%でanimation end.
		}

		/*
		 * Parallax
		 */
		var Parallax = function (elm, options) {
			var self = this;
			self.o = $.extend({}, DEFAULT_OPTIONS, options);
			self.$elm = $(elm);
			self._init();
		}

		Parallax.prototype._init = function () {
			var self = this;
			self._refresh();
			self._eventify();
			self._jarallax();
		}

		Parallax.prototype._eventify = function () {
			var self = this;

			$(window).on('scroll', function () {
				self._refresh();
				self._draw();
			});

//			$(window).on('resize', function () {
//				self._jarallax();
//			});
		}

		Parallax.prototype._refresh = function () {
			var self = this;
			// 現在のスクロールtop位置を取得
			self.scrollPosTop = $(document).scrollTop();
			// elmのposition top位置を取得
			self.elmPosTop = self.$elm.offset().top;
			self.documentH = $(document).height();
			self.windowH = $(window).height();
			self.scrollPercent = self.scrollPosTop / (self.documentH - self.windowH) * 100;
			self.startPosTop = self.elmPosTop - (self.windowH * self.o.animationStart);
			self.endPosTop = self.elmPosTop - (self.windowH * self.o.animationEnd);
			self.startPercent = self.startPosTop / (self.documentH - self.windowH) * 100;
			self.endPercent = (function () {
				var endPercent = self.endPosTop / (self.documentH - self.windowH) * 100;
				return (endPercent > 100) ? 100: endPercent;
			})();


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
			var jarallax = new Jarallax(new ControllerScroll(true));

			jarallax.addAnimation(self.$elm,[
				{progress:'0%', opacity:'0'},
				{progress: self.startPercent+'%', opacity:'0'},
				{progress: self.endPercent+'%', opacity:'1'},
				{progress:'100%', opacity:'1'}
			]);
		}


		$('.box').each(function () {
			new Parallax(this);
		});
		
		


	});
})(jQuery, this);
