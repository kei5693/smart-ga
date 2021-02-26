/*
 * [EDA] UI Dev Team
 * @description [EDA] Core Library
 */

;(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery')) :
	typeof define === 'function' && define.amd ? define(['jquery'], factory) :
	(factory(global.jQuery));
  }(this, (function ($) {
	'use strict';
  
	$.fn.datepicker.languages['ko-KR'] = {
	  autoHide: true,
	  format: 'yyyy.mm.dd',
	  days: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
	  daysShort: ['일', '월', '화', '수', '목', '금', '토'],
	  daysMin: ['일', '월', '화', '수', '목', '금', '토'],
	  months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	  monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	  weekStart: 1,
	  yearFirst: true,
	  yearSuffix: '년',
	  zIndex: 6000,
	};
  })));

(function() {
	var Class = {
		winHeight:0
		, winWidth:0
		, popZIndex:5000
		, didScroll:false
		, isMobile: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? true : false
		, isWide : false
		, evTouchStart: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchstart' : 'mousedown'
		, evTouchMove: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchmove' : 'mousemove'
		, evTouchEnd: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchend' : 'mouseup'
		, animEndEventName : {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		}[ Modernizr.prefixed( 'animation' ) ],
		/* initBrowser */	initBrowserOnce: function initBrowserOnce() {
			var ua = navigator.userAgent;
			if((/Android/i).test(ua)) {
				$('html').addClass('Android').data('browser', 'Android');
				var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)); 
				// console.log(androidversion);
				if (androidversion >= 5)
				{   
					console.log('greater than or equal to Android5');
				} else {
					console.log('less than Android5')
					//mSite.mobile.toast('less than Android5');
				}
			} else if((/iPad|iPhone|iPod/i).test(ua)) {
				$('html').addClass('iOS').data('browser', 'iOS');
			} else if((/Chrome/i).test(ua)) {
				$('html').addClass('Chrome').data('browser', 'Chrome');
			}
		},
		/* toast */	toast: function toast(str, toastTarget) { //toast(str, toastTarget)
			var $toast = $('#toast');
			if($toast.length<1) {
				$toast=$('<div id="toast"></div>');
				if(toastTarget){
					toastTarget.prepend($toast);
				} else{
					$('body').append($toast);
				}
			}
			$toast.append('<span>'+str+'</span>').addClass('on');
			var $toastTimer = setTimeout(function(){
				$toast.removeClass('on');
				var $toastTimer2 = setTimeout(function(){
						$toast.remove();
					},4000);
				},2000);
		},
		/* WingMenu */	initWingMenuOnce: function initWingMenuOnce() {
			var $hideObj = $('#wrap');
			$(document)
				.off('click', '.js_menu_r')
				.on('click', '.js_menu_r', function(e) {
					if(!$('html').hasClass('menur_open')) {
						$(this).attr('aria-expanded', 'true');
						$( 'html, body' ).stop().animate({scrollTop:0},100);
						$(document).trigger('showMenuR');
					}
					e.preventDefault();
					e.stopPropagation();
				})
				.off('showMenuR')
				.on('showMenuR', function() {
					$('html').addClass('menur_open');
					if($hideObj.parent().find('layerpop_fade').length<1) {
						$hideObj.parent().append('<div class="layerpop_fade"></div>');
					}
					// var dimIndex = $popObj.css('zIndex') - 1;
					$('layerpop_fade').addClass('show');
					$hideObj.attr('aria-hidden', 'true');
					$('#menu_right').attr('aria-hidden', 'false').attr('tabindex', 0).focus();
					$('.js_menu_r').attr('aria-expanded', 'true');
				})
				.off('hideMenuR')
				.on('hideMenuR', function() {
					$('html').removeClass('menur_open');
					$('.layerpop_fade').remove();
					$hideObj.attr('aria-hidden', 'false');
					$('#menu_right').attr('aria-hidden', 'true').removeAttr('tabindex');
					$('.js_menu_r').attr('aria-expanded', 'false').focus();
				})
				.off('click', '#menu_right .btn_close')
				.on('click', '#menu_right .btn_close', function(e) {
					$(document).trigger('hideMenuR');
					e.preventDefault();
				})
				.off(Class.evTouchStart, '#wrap')
				.on(Class.evTouchStart, '#wrap', function() {
					$(document).trigger('hideMenuR');
				});
		},
		/* form 삭제버튼 */	initFormMotionOnce : function initFormMotionOnce(){
			var $body = $('body');
			$(document)
				.off('focus, focusin, click', '.input_wrap input:not([readonly]), .input_wrap textarea')
				.on('focus, focusin, click', '.input_wrap input:not([readonly]), .input_wrap textarea' , function(e){
					if(this.value.length>0){
						if($(this).closest('.input_wrap').hasClass('reinput')){ $(this).addClass('inputed').closest('.input_wrap').removeClass('reinput').addClass('on');}
						else{$(this).addClass('inputed').closest('.input_wrap').addClass('on');}
					}else{
						$(this).removeClass('inputed').closest('.input_wrap').removeClass('on').addClass('reinput')
					}
					$body.addClass('keypad');
				})
				.off('keypress, keyup', '.input_wrap input:not([readonly]), .input_wrap textarea')
				.on('keypress, keyup', '.input_wrap input:not([readonly]), .input_wrap textarea' , function(e){
					if(this.value.length>0){
						if($(this).closest('.input_wrap').hasClass('reinput')){ $(this).addClass('inputed').closest('.input_wrap').removeClass('reinput').addClass('on');}
						else{$(this).addClass('inputed').closest('.input_wrap').addClass('on');}
					}else{
						$(this).removeClass('inputed').closest('.input_wrap').removeClass('on').addClass('reinput')
					}
					$body.addClass('keypad');
				})
				.off('blur, focusout', '.input_wrap input:not([readonly]), .input_wrap textarea')
				.on('blur, focusout', '.input_wrap input:not([readonly]), .input_wrap textarea' , function(e){
					if(this.value.length>1){ $(this).removeClass('inputed').closest('.input_wrap').removeClass('on') }
					else{$(this).removeClass('inputed').closest('.input_wrap').removeClass('on').addClass('reinput')}
					$body.removeClass('keypad');
				})
				.off('keyup', 'input[type="number"]')
				.on('keyup', 'input[type="number"]', function() {
					var maxlength = parseInt($(this).attr('maxlength'));
					if( $(this).val().length > maxlength ) {
						$(this).val( $(this).val().slice(0,maxlength) );
					}
				})
		},
		/* radio, checkbox svg */initCheckRadioSVGOnce: function initCheckRadioSVGOnce(){
			var $checkboxSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path id="checkbox-id" data-name="checkbox" d="M18,19H6a1,1,0,0,1-1-1V6A1,1,0,0,1,6,5H18a1,1,0,0,1,1,1V18A1,1,0,0,1,18,19ZM19,3H5A2.006,2.006,0,0,0,3,5V19a2.006,2.006,0,0,0,2,2H19a2.006,2.006,0,0,0,2-2V5A2.006,2.006,0,0,0,19,3Z" transform="translate(-3 -3)" /></svg>',
				$checkboxSvgCheck = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path id="checkbox-check-id" data-name="checkbox-check" d="M19,3H5A2.006,2.006,0,0,0,3,5V19a2.006,2.006,0,0,0,2,2H19a2.006,2.006,0,0,0,2-2V5A2.006,2.006,0,0,0,19,3ZM10.71,16.29a1,1,0,0,1-1.41,0L5.71,12.7a1,1,0,0,1,1.41-1.41L10,14.17l6.88-6.88A1,1,0,0,1,18.29,8.7l-7.58,7.59Z" transform="translate(-3 -3)" /></svg>',
				$radioSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path id="radio-id" data-name="radio" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" transform="translate(-2 -2)"/></svg>',
				$radioSvgCheck = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><g id="radio-check-id" data-name="radio-check" transform="translate(-664 -293)"><path id="radio-sub-check-id" data-name="radio-sub-check" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" transform="translate(662 291)" /><circle id="타원_36" data-name="타원 36" cx="5" cy="5" r="5" transform="translate(669 298)" /></g></svg>',
				$agreeCheckboxSvg = '<svg id="agr-check" xmlns="http://www.w3.org/2000/svg" width="13.165" height="9.585" viewBox="0 0 13.165 9.585"><path id="check-2" data-name="check" d="M10.71,16.29a1,1,0,0,1-1.41,0L5.71,12.7a1,1,0,0,1,1.41-1.41L10,14.17l6.88-6.88A1,1,0,0,1,18.29,8.7l-7.58,7.59Z" transform="translate(-5.418 -6.997)" fill="#c7c0b8"/></svg>';
				

			$('.checkbox.icon, .radio.icon')
				.each(function() {
					
					var $from =  $(this),
						$label = $from.find('label'),
						$svg = $label.find('svg');

					$svg.remove();

					if($from.parent().parent().parent().hasClass('agr_list')){
						$label = $('.agr_list li .checkbox.icon label');
						$label.append($agreeCheckboxSvg);
					}else if($from.hasClass('checkbox')){
						if($from.hasClass('check')){
							$label.append($checkboxSvgCheck);
						}else{
							$label.append($checkboxSvg);
						}
					}else if($from.hasClass('radio')){
						if($from.hasClass('check')){
							$label.append($radioSvgCheck);
						}else{
							$label.append($radioSvg);
						}
					}

				});
		},
		/* radio, checkbox */ initCheckRadioSelectOnce: function initCheckRadioSelectOnce(){
			$(document)
				.off('click', 'input:radio, input:checkbox')
				.on('click', 'input:radio, input:checkbox', function() {
					var $input = $(this);
					var name = $input.attr('name');
					var id = $input.attr('id');
					var type = $input.attr('type');

					if(type=='radio') {
						$('input[name="'+name+'"]')
							.each(function() {
								var id=$(this).attr('id');
								$('label[for="'+id+'"]').closest('.radio').removeClass('check');
							});
							$('label[for="'+id+'"]').closest('.radio').addClass('check');
					} else {
						if($input.is(':checked')) {
							$('label[for="'+id+'"]').closest('.checkbox').addClass('check');
						} else {
							$('label[for="'+id+'"]').closest('.checkbox').removeClass('check');
						}
					}
					Class.initCheckRadioSVGOnce();
			});
		},
		/* jsTabs */	initTabsCtrlOnce: function initTabsCtrlOnce(){
			$(document)
				.off('click', '.jstab:not(.link) .tabinner .tabs>li')
				.on('click', '.jstab:not(.link) .tabinner .tabs>li', function(e) {
					var $current = $(this);
					var index = $current.index();
					// var $panels = $current.parent().parent().siblings('.panels').length > 0 ? $current.parent().parent().siblings('.panels') : $current.parents('.scrollWrap').siblings('.panels');
					var $panels = $current.parent().parent().siblings('.panels');

					// var $left = ($current.innerWidth()-10) * index;
					// $current.parent().parent().scrollLeft($left)

					$current.addClass('selected').find('>a').attr('aria-selected','true');
					$current.siblings().removeClass('selected').find('>a').attr('aria-selected','false');
					var $target = $panels.find('>.panel:eq(' + index + ')');
					$target.addClass('selected').attr('tabindex', 0).siblings().removeClass('selected').removeAttr('tabindex');
					e.stopPropagation();
					e.preventDefault();
			});
		},
		/* jsacc */	initAccordionOnce: function initAccordionOnce(){
			$(document)
				.off('showOneAcc', '.jsacc .li .view')
				.on('showOneAcc', '.jsacc .li .view', function(e) {
					$(this).show().attr('aria-hidden', "false");
					e.preventDefault();
					e.stopPropagation();
				})
				.off('hideOneAcc', '.jsacc .li .view')
				.on('hideOneAcc', '.jsacc .li .view', function(e) {
					$(this).hide().attr('aria-hidden', "true");
					e.preventDefault();
					e.stopPropagation();
				})
				.off('click', '.jsacc .li .head')
				.on('click', '.jsacc .li .head', function(e) {
					var $obj = $(this);
					var $target = $obj.attr('aria-controls');

					if(!$obj.hasClass('active')){
						$('#' + $target).addClass('active').trigger('showOneAcc');
						$obj.parent('.holder').addClass('active');
						$obj.addClass('active').attr('aria-expanded', 'true');
					} else {
						$('#' + $target).removeClass('active').trigger('hideOneAcc');
						$obj.parent('.holder').removeClass('active');
						$obj.removeClass('active').attr('aria-expanded', 'false');
					}
					e.preventDefault();
				});
		},
		/* on 토글 */	initToggleOnce: function initToggleOnce() {
			$(document)
			.off('click', '.jstoggle')
			.on('click', '.jstoggle', function(e) {
				var $is = $(this).prop('tagName');
				//console.log($is);
				var target = null;
				var $obj = $(this);
				if($is == 'A'){
					var target= $obj.attr('href');
				} else {
					var target = $obj.data('target');
				}
                var $text = $obj.text();

				if(!$obj.hasClass('on')){
					$obj.addClass('on').attr('aria-expanded', 'true');
					if($obj.data('text')){
						var $textTo = $obj.data('text');
						$obj.data('text', $text).text($textTo);
					}
					if(typeof target === 'undefined') {
						$target= $obj;
					} else {
						$target = $(target);
						$( 'html, body' ).stop().animate({scrollTop:$target.offset().top },400);
						$target.addClass('on').attr('aria-hidden', 'false'); //.attr('tabindex', 0).focus();
						//console.log($(document).scrollTop());
					}
                } else {
					$obj.removeClass('on').attr('aria-expanded', 'false');
					if($obj.data('text')){
						var $textTo = $obj.data('text');
						$obj.data('text', $text).text($textTo);
					}
					if(typeof target === 'undefined') {
						$target= $obj;
					} else {
						$target = $(target);
						//$( 'html, body' ).stop().animate({scrollTop:$target.offset().top + 70 },400);
						$target.removeClass('on').attr('aria-hidden', 'true'); //.attr('tabindex', 0).focus();
					}
                }
				e.preventDefault();
			})
			.off('click','.jstogglewrap .cls')
			.on('click','.jstogglewrap .cls', function(e){
				var id = $(this).data('target');
				var $target = $('[href="#'+ id +'"]');
				$(this).closest('.jstogglewrap').removeClass('on').attr('aria-hidden', 'true');
				$(this).parent().parent().find('.jstoggle').removeClass('on').attr('aria-expanded', 'false').focus();
            })
			.off('click','button.icoStar')
            .on('click','button.icoStar', function(e){
                $(this).toggleClass('on');
            })
			.off('touchend')
			.on('touchend',function(e) {
				var container = $('.utLayer.jstogglewrap.on');
				if (!container.is(e.target) && container.has(e.target).length === 0){
						$('.btnDot.jstoggle.on').removeClass('on').attr('aria-expanded', 'false');
						$('.utLayer.jstogglewrap.on').removeClass('on').attr('aria-hidden', 'true');
					}
				//console.log('touchend');
			})
		},
		
		/* 레이어팝업 버튼 */	initLayerPopupOnce: function initLayerPopupOnce() {
			$(document)
				.off('click', 'a.js_btnlayerpop')
				.on('click', 'a.js_btnlayerpop', function(e) {
					var popID = $(this).attr('href');
					setTimeout(function() {
						Class.setLayout();
					}, 300);
					$(this).addClass('on');
					Class.layerPopupOpen(popID);
					e.preventDefault();
					e.stopPropagation();
				})
				.off('click', 'input.js_btnlayerpop, button.js_btnlayerpop')
				.on('click', 'input.js_btnlayerpop, button.js_btnlayerpop', function() {
					var $obj = $(this);
					var type = $obj.attr('type');
					var popID = $(this).data('target');
					$(this).addClass('on');
					if(type=='radio' || type=='checkbox') {
						var chk = $(this).is(":checked");
						if(chk){
							Class.layerPopupOpen(popID);
						}
					} else if(type=='button'){
						Class.layerPopupOpen(popID);
					}
					
					//e.preventDefault();
					//e.stopPropagation();
				})
				.off('click', '.layerpop_wrap .js_close')
				.on('click', '.layerpop_wrap .js_close', function(e) {
					$(this).parents('.layerpop_wrap').trigger('closePopup');
					e.preventDefault();
				})
				.off('closePopup', '.layerpop_wrap')
				.on('closePopup', '.layerpop_wrap', function(e) {
					var $hideObj = $('#wrap');
					$hideObj.attr("aria-hidden", false);
					$curLayerPop = $(this).removeClass('show').removeAttr("aria-hidden");
					$curLayerPop.find('.layerpop_header .tit').removeAttr('tabindex');
					var target = '#'+$curLayerPop.attr("id");
					var $target = $('.on[href="'+ target +'"]').length ? $('.on[href="'+ target +'"]') : $('.on[data-target="'+ target +'"]');
					
					$target.focus().removeClass('on');

					setTimeout(function() {
						$curLayerPop.hide();
						var $showPop = $('.layerpop_wrap.show');
						//var dimIndex = $curLayerPop.css('zIndex') - 1;
						var $highestIndex = 0;

						for (var i = 0; i < $showPop.length; i++) {
							var $zindex = document.defaultView.getComputedStyle($showPop[i], null).getPropertyValue('z-index');
							if (($zindex > $highestIndex) && ($zindex != 'auto')) {
								$highestIndex = $zindex;
								$highestIndex = $highestIndex - 1;
							}
						}
						$('layerpop_fade').css({zIndex:$highestIndex});
						//console.log('popup ' + $curLayerPop.css('zIndex') + ' dimed ' + $highestIndex);
					}, 300);
					if($('.layerpop_wrap.show').length<1){
						$('html').removeClass('lypop_open');
					}
					setTimeout(function() {
						if(!$('html').hasClass('lypop_open'))
						$('.layerpop_fade').remove();
					}, 300);

					e.stopPropagation();
				})
				.off(Class.evTouchStart, '#wrap')
				.on(Class.evTouchStart, '#wrap', function() {
					//$('.layerpop_wrap.fade.show').find('.js_close').click();
				});
		},
		/* 레이어팝업 열기 */	layerPopupOpen: function layerPopOpen(id) {
			var $wrap = $('#wrap');
			var $popObj = $(id);
			var $maxPopH = Class.winHeight;

			if($popObj.length>0){
				$popObj.css({zIndex:Class.popZIndex++}).show(); 
				$wrap.attr('aria-hidden', true);

				// setTimeout(function() {
				// 	$popObj.addClass('show');
				// }, 100);

				if($popObj.find('.layerpop_conts').outerHeight() > $maxPopH *.7 && !$popObj.hasClass('full')){
					$popObj.find('.layerpop_body').css({'overflowY' : 'scroll', height : $maxPopH *.65});
					//console.log('default set');
				} else if($popObj.hasClass('full')){
					var $header = $popObj.find('.layerpop_header').length > 0 ? $popObj.find('.layerpop_header').outerHeight() : 0 ;
					var $footer = $popObj.find('.layerpop_foot').length > 0 ? $popObj.find('.layerpop_foot').outerHeight() : 0 ;
					var $space = 2 * (parseFloat(getComputedStyle(document.body).fontSize)/1.4);
					$space = Math.floor($space);
					//console.log($maxPopH, $header, $footer, $space);
					$popObj.find('.layerpop_body').css({'overflowY' : 'scroll', height : $maxPopH - ($header + $footer + $space)});
					//console.log('full set');
				}

				if($popObj.hasClass('bottom')){
					setTimeout(function() {
						if($popObj.find('.layerpop_header .tit').length){
							$popObj.find('.layerpop_header .tit').attr('tabindex', 0).focus();
						} else{
							$popObj.find('.layerpop_conts').attr('tabindex', 0).focus();
						}
						//console.log('lypop bottom');
					}, 500);
					$popObj.addClass('show').attr('aria-hidden', false);
				} else {
					setTimeout(function() {
						if($popObj.find('.layerpop_header .tit').length){
							$popObj.find('.layerpop_header .tit').attr('tabindex', 0).focus();
						} else{
							$popObj.find('.layerpop_conts').attr('tabindex', 0).focus();
						}
						//console.log('lypop default');
					}, 300);
					$popObj.addClass('show').attr('aria-hidden', false);
				}

				if($wrap.parent().find('layerpop_fade').length<1) {
					$wrap.parent().append('<div class="layerpop_fade"></div>');
				}
				var dimIndex = $popObj.css('zIndex') - 1;
				$('layerpop_fade').css({zIndex:dimIndex}).addClass('show');
				//console.log('popup ' + $popObj.css('zIndex') + ' dimed ' + dimIndex);
				$('html').addClass('lypop_open');
			}
		}, 
		/* 팝업 위치 조정 */	repositionPopup: function repositionPopup() {
			var $popObj = $(this);
			if($popObj.length>0 && $popObj.hasClass('show')){
				var $maxPopH = Class.winHeight;
				$popObj.find('.layerpop_body').removeAttr('style');

				if($popObj.find('.layerpop_conts').outerHeight() > $maxPopH *.7){
					$popObj.find('.layerpop_body').css({'overflowY' : 'scroll', height : $maxPopH *.65});
					//console.log('repositionPopup default');
				}
				if($popObj.hasClass('full')){
					var $header = $popObj.find('.layerpop_header').length > 0 ? $popObj.find('.layerpop_header').outerHeight() : 0 ;
					var $footer = $popObj.find('.layerpop_foot').length > 0 ? $popObj.find('.layerpop_foot').outerHeight() : 0 ;
					var $space = 2 * (parseFloat(getComputedStyle(document.body).fontSize)/1.4);
					$space = Math.floor($space);
					//console.log($popObj.find('.layerpop_header').length);
					//console.log($maxPopH, $header, $footer, $space);
					$popObj.find('.layerpop_body').css({'overflowY' : 'scroll', height : $maxPopH - ($header + $footer + $space)});
					//console.log('repositionPopup full');
				}
				
			}
		},
		/* 스크린 크기 변경시 */	initResizeOnce: function initResizeOnce() {
			$(window)
				.on('resize', function() {
					Class.winWidth = Math.min(window.innerWidth, window.outerWidth);
					Class.winHeight = Math.min(window.innerHeight, window.outerHeight);
					var $wrap = $('#wrap');

					Class.repositionPopup.call($('.layerpop_wrap.show'));

					/* 가로비율 */
					if(Class.winWidth>=768) {
						$('html').removeClass('small normal').addClass('mobile wide');
						$wrap.css({minWidth:Class.winWidth});
						Class.isWide = true;
					} else if(Class.winWidth<=320) {
						$('html').removeClass('wide normal').addClass('mobile small');
						$wrap.css({minWidth:Class.winWidth});
						Class.isWide = false;
					} else {
						$('html').removeClass('wide small').addClass('mobile normal');
						$wrap.css({minWidth:Class.winWidth});
						Class.isWide = false;
					}

					/*if(Class.winWidth > Class.winHeight){
						$('html').removeClass('portrait').addClass('landscape');
					} else {
						$('html').removeClass('landscape').addClass('portrait');
					}*/
					Class.setLayout();
				})
				.trigger('resize');
		},
		
		
		/* 레이아웃 세팅 */	setLayout: function setLayout() {
		
			Class.winWidth = Math.min(window.innerWidth, window.outerWidth);
			Class.winHeight = Math.min(window.innerHeight, window.outerHeight);
			
			if($('[data-toggle="datepicker"]').attr('placeholder')){
				$('[data-toggle="datepicker"]').datepicker({
					language: 'ko-KR'
				});
			}else{
				$('[data-toggle="datepicker"]').datepicker({
					language: 'ko-KR',
					autoPick: true
				});
			}

			// layerpopup 에 브랜드 클래스 추가하기 start
			var $wrap = $('#wrap').attr('class');

			if(!($wrap === undefined)){
				var $html = $('html'),
					$addClassName = "";
				$wrapClass = $wrap.split(' ');
				for(i=0; $wrapClass.length > i; i++){
					if(!($wrapClass[i] === 'bg_color')) $addClassName = $wrapClass[i];
				}
				$html.addClass($addClassName);
			}
			// layerpopup 에 브랜드 클래스 추가하기 end
			
			if($('.swiper-container').length>0){
				var $swiperContainer = $('.swiper-container');
				$swiperContainer.each(function(){
					var $swiperContainer = $(this);
					if($swiperContainer.hasClass('main-swiper')){
						var swiper = new Swiper($swiperContainer, {
								observer:true,
								observeParents : true,
								autoplay:{
									delay:3000,
									disableOnInteraction:false,
									waitForTransition:false,
								},
								speed:400,
								spaceBetween:22,
								pagination: {
									el: '.swiper-pagination',
									type: 'fraction',
									renderFraction: function (currentClass, totalClass) {return '<span class="' + currentClass + '"></span>' + ' <span>｜</span> ' + '<span class="' + totalClass + '"></span>'; },
								},
								on:{
									init : function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									},
									transitionStart:function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									}
								}
							}
						);
					}else if($swiperContainer.hasClass('soon-swiper')){
						var swiper = new Swiper($swiperContainer, {
								observer:true,
								observeParents : true,
								// autoplay:{
								// 	delay:3000,
								// 	disableOnInteraction:false,
								// 	waitForTransition:false,
								// },
								// speed:400,
								spaceBetween:10,
								pagination: {
									el: '.swiper-pagination',
									type: 'fraction',
									renderFraction: function (currentClass, totalClass) {return '<span class="' + currentClass + '"></span>' + ' <span>｜</span> ' + '<span class="' + totalClass + '"></span>'; },
								},
								on:{
									init : function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									},
									transitionStart:function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									}
								}
							}
						);
					}else if($swiperContainer.hasClass('gift-photo-swiper')){
						var swiper = new Swiper($swiperContainer, {
								observer:true,
								observeParents : true,
								spaceBetween:10,
								navigation: {
									nextEl: '.swiper-button-next',
									prevEl: '.swiper-button-prev',
								},
								on:{
									init : function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									},
									transitionStart:function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									}
								}
							}
						);
					}else if($swiperContainer.hasClass('conts-swiper')){
						var swiper = new Swiper($swiperContainer, {
								observer:true,
								observeParents : true,
								slidesPerView: 'auto',
								spaceBetween: 14,
								on:{
									init : function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									},
									transitionStart:function(){
										$swiperContainer.find('.swiper-slide').attr('aria-hidden',true).removeAttr('tabindex');
										$swiperContainer.find('.swiper-slide.swiper-slide-active').attr('aria-hidden', false).attr('tabindex', 0);
									}
								}
							}
						);
					}
					
				});
			}

		},
		/* smartGA 초기화 */ init: function() {
			for(var func in Class) {
				if(Class.hasOwnProperty(func)) {
					if(func !== 'init' && func.indexOf('init')==0) {
						var $document = $(document);
						if(func.lastIndexOf('Once')+4 == func.length && !$document.data(func)) {
							$document.data(func, true);
							//console.log('init1 ' + func + ' ' + func.lastIndexOf('Once'), func.length);
							Class[func].call(this);
							
						} else if (func.lastIndexOf('Once')+4 != func.length) {
							//console.log('init2 ' + func + ' ' + func.lastIndexOf('Once'), func.length);
							Class[func].call(this);
							
						}
					}
				}
			}
		}
	};
	if(typeof this['smartGA'] !== 'undefined') {
		this['smartGA']['mobile']=Class;
	} else {
		this['smartGA'] = {mobile:Class};
	}

})();

$.fn.smartGA = smartGA.mobile.init;
$(function() {
	$(document).smartGA();
});
