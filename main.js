/*!
 * main.js
 *
 */
 
;(function ($, window, undefined) {
	$(document).ready(function(){
		/*
		 * Parallax
		 */
		(function () {
			var PLUGIN_NAME = 'parallax';
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
			Parallax = function (elm, options) {
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

			/**
			 * $.fn[PLUGIN_NAME]
			 */
			$.fn[PLUGIN_NAME] = function (options) {
				return this.each(function () {
					//data属性にPLUGIN_NAME Objがなければインスタンス作成
					if (!$.data(this, PLUGIN_NAME)) {
						$.data(this, PLUGIN_NAME, new Parallax(this, options));
					} else {
						//data属性にPLUGIN_NAME Objが既にあれば、PLUGIN_NAME + i 名でインスタンス作成
						for (var i = 2; true; i++) {
							if (!$.data(this, PLUGIN_NAME + i)) {
								$.data(this, PLUGIN_NAME + i, new Parallax(this, options));
								break;
							}
						}
					}
				});
			};

		})();



		/*
		 * ParallaxGroup
		 */
		(function () {
			var PLUGIN_NAME = 'parallaxGroup';
			var ParallaxGroup;
			var DEFAULT_OPTIONS;

			/**
			 * DEFAULT_OPTIONS
			 */
			DEFAULT_OPTIONS = {

			}

			/*
			 * ParallaxGroup
			 */
			ParallaxGroup = function (elm, options) {
				var self = this;
				self.o = $.extend({}, DEFAULT_OPTIONS, options);

				self.$elm = $(elm);

				self._init();
			}

			ParallaxGroup.prototype._init = function () {
				var self = this;
				self._refresh();
			}

			ParallaxGroup.prototype._refresh = function () {
				var self = this;
			}

			/**
			 * $.fn[PLUGIN_NAME]
			 */
			$.fn[PLUGIN_NAME] = function (options) {
				return this.each(function () {
					//data属性にPLUGIN_NAME Objがなければインスタンス作成
					if (!$.data(this, PLUGIN_NAME)) {
						$.data(this, PLUGIN_NAME, new ParallaxGroup(this, options));
					} else {
						//data属性にPLUGIN_NAME Objが既にあれば、PLUGIN_NAME + i 名でインスタンス作成
						for (var i = 2; true; i++) {
							if (!$.data(this, PLUGIN_NAME + i)) {
								$.data(this, PLUGIN_NAME + i, new ParallaxGroup(this, options));
								break;
							}
						}
					}
				});
			};

		})();





		$('.p').parallax({
			animation: 'rightToLeft'
		});

		$('.ui-parallax-fade').parallax({
			animation: 'fade'
		});

		$('.ui-parallax-rightToLeft').parallax({
			animation: 'rightToLeft'
		});

		$('.ui-parallax-bottomToTop').parallax({
			animation: 'bottomToTop'
		});

		var $elm = $('.ui-parallaxGroup');
		var $items = $elm.children();
		var baseElmPosTop = $items.eq(0).offset().top;
		var addNum = 50;

		$items.each(function () {
			var self = this;

			function _init() {
				_action();
				_calc();
			}

			function _action() {
				$(self).parallax({
					animation: 'rightToLeft'
					,elmPosTop: baseElmPosTop
				});
			}

			function _calc() {
				baseElmPosTop += addNum;
			}

			_init();
		});
		
		


	});
})(jQuery, this);
