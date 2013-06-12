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
				,animationStart: 0.6 // {number} - 1:画面の高さが残り100%でanimation start, 0.5:残り50%でanimation start.
				,animationEnd: 0.4 // {number} - 0:画面の高さが残り0%でanimation end, 0.3:残り30%でanimation end.
				,elmPosTop: 'auto' // {string | number} - 'auto':elmのoffset top位置を自動取得, 100: bodyから100pxの位置にelmがあるとして計算されるようになる。parallax-groupで使用
			}

			/*
			 * Parallax
			 */
			Parallax = function (elm, options) {
				var self = this;
				self.o = $.extend({}, DEFAULT_OPTIONS, options);

				self.$elm = $(elm);

				// data属性がある場合はoption値を上書き
				self.o.animation = (self.$elm.attr('data-parallax-animation'))
					? (self.$elm.attr('data-parallax-animation'))
					: self.o.animation;
				self.o.animationStart = (self.$elm.attr('data-parallax-animationStart'))
					? parseFloat(self.$elm.attr('data-parallax-animationStart'))
					: self.o.animationStart;
				self.o.animationEnd = (self.$elm.attr('data-parallax-animationEnd')
					? parseFloat(self.$elm.attr('data-parallax-animationEnd'))
					: self.o.animationEnd);

				// elmのposition top位置を取得
				self.elmPosTop = (self.o.elmPosTop === 'auto')
					? self.$elm.offset().top
					: self.o.elmPosTop;
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
				self._trigger();
			}

			Parallax.prototype._eventify = function () {
				var self = this;

				$(window).on('scroll', function () {
					self._refresh();
					self._draw();
					self._trigger();
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

			Parallax.prototype._trigger = function () {
				var self = this;
				if (self.scrollPosTop >= self.endPosTop) {
					self.$elm.trigger('parallaxEnd');
				}
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
							{progress:'0%', opacity:'0', top: '100px'},
							{progress: self.startPercent+'%', opacity:'0', top: '100px'},
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
				addNum: 50 // {number}
				,specifyChild: false // {boolean}
				,childClassSelector: '[data-parallax-child]' // {selector} - ('[data-parallax-child]' | '.ui-parallax-child')
			}

			/*
			 * ParallaxGroup
			 */
			ParallaxGroup = function (elm, options) {
				var self = this;
				self.o = $.extend({}, DEFAULT_OPTIONS, options);

				self.$elm = $(elm);
				self.$items = self.$elm.children();

				// data属性がある場合はoption値を上書き
				self.o.animation = (self.$elm.attr('data-parallax-animation'))
					? (self.$elm.attr('data-parallax-animation'))
					: self.o.animation;
				self.o.animationStart = (self.$elm.attr('data-parallax-animationStart'))
					? parseFloat(self.$elm.attr('data-parallax-animationStart'))
					: self.o.animationStart;
				self.o.animationEnd = (self.$elm.attr('data-parallax-animationEnd')
					? parseFloat(self.$elm.attr('data-parallax-animationEnd'))
					: self.o.animationEnd);
				self.o.specifyChild = (self.$elm.attr('data-parallax-specifyChild'))
					? (self.$elm.attr('data-parallax-specifyChild'))
					: self.o.specifyChild;

				// set items - パララックスを適用させるitems
				self.$items = (self.o.specifyChild)
					? self.$elm.find(self.o.childClassSelector)
					: self.$elm.children();

				// 最初の子要素のoffset top
				self.o.elmPosTop = self.$items.eq(0).offset().top;

				self._init();
			}

			ParallaxGroup.prototype._init = function () {
				var self = this;
				self.$items.each(function () {
					self.$item = $(this);
					self._action();
					self._calc();
				});
			}

			ParallaxGroup.prototype._action = function () {
				var self = this;
				self.$item.parallax(self.o);
			}

			ParallaxGroup.prototype._calc = function () {
				var self = this;
				self.o.elmPosTop += self.o.addNum;
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




		$('[data-parallax]').parallax();

		$('[data-parallax-group]').parallaxGroup();

		$('.p').parallax({
			animation: 'rightToLeft'
		});


		$('.ui-carousel').liquidCarousel({
			autoPlay:             false // {boolean} - true: autoplay
			,autoPlayHoverStop:    false // {boolean} - true: itemにマウスオーバー中はautoplayをストップ
			,autoPlayInterval:     1000 // {number} (milli second) - autoplayの間隔
		});

		(function () {
			var parallax = $('.ui-parallax-trigger').data('parallax');
			var carousel = $('.ui-carousel').data('carousel');
			var isMoved = false;
			parallax.$elm.on('parallaxEnd', function () {
				if (isMoved === false) {
					isMoved = true;
					carousel.autoPlay();
					carousel.moveBind(carousel.index + 1);
				}
			})
		})();
	});
})(jQuery, this);
