var $ = jQuery; // Use the $ sign in your jQuery plugin

var RC = RC || {

	headerScroll: null,
	scrollInterval: null,
	scrollIntervalDelay: 5000,

	init: function rc_init() {
		/*
		$('.works-container').masonry({
		  itemSelector: '.box'
		});
		*/

		this.worksInit();
		//this.introPositionInit();
		this.mobileMenuInit();

		//$(window).scroll(PLASTIC.fixMenu);

		/*
		var map;
		function initialize() {
			var myLatlng = new google.maps.LatLng(41.385778, 2.176721);
			
			var styles = 
			[
			  {
			    "stylers": [
			      { "saturation": -100 }
			    ]
			  }
			];

			var mapOptions = {
				scrollwheel: false,
				zoom: 16,
				center: myLatlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: styles
			};
			map = new google.maps.Map(document.getElementById('page-map'), mapOptions);

			map.setOptions

			var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: 'Plastic',
			icon: 'http://plasticbcn.com/new/wp-content/themes/Foundation-master-child/img/plastic-map-marker.png'
			});
			
		}

		google.maps.event.addDomListener(window, 'load', initialize);
		*/
		// 

		// bind menu scroll
		$('body').on('click', '.top-bar-section li:not(.lang-selector) a', function () {
			$('html, body').animate({
			    scrollTop: $($(this).attr('href')+':eq(0)').offset().top-$('.page-header').height()
			 }, 2000);
			var currentItem = $(this).parents('.menu-item');
			currentItem.siblings(':not(.lang-selector)').removeClass('active');
			currentItem.addClass('active');
			return false;
		});

		// arrow zone under header scrolling like home option
		$('body').on('click','.scroll-to-view', function () {
			$('html, body').animate({
			    scrollTop: $('#nosotros').offset().top - $('.page-header').height()
			 }, 2000);
		});

		// run iscroll
		RC.headerScroll = new IScroll('.slideshow-wrapper', {
			snap: 'li',
			scrollbars: false,
			scrollX: true, 
			scrollY: false,
			bounce: false,
			eventPassthrough: true,
			tap: true,
			momentum: false,
			snapThreshold: 0.01,
			snapSpeed:1000,
			//deceleration: 0.005
		});

		RC.headerScroll.on('scrollEnd', function () {
		    RC.animateHeaderNav(RC.headerScroll.currentPage.pageX || 0);
		});

		RC.scrollInterval = setInterval(function () {
		    var nextPage = RC.headerScroll.currentPage.pageX + 1;
			if (nextPage>=$('.slideshow-wrapper li').length) {
				nextPage=0;
			}
			RC.headerScroll.goToPage(nextPage, 0, 1000);
		}, RC.scrollIntervalDelay);

		$('.slideshow-wrapper').on('tap', 'li', function () {
			var workId=$(this).data('id');
			//if (parseInt(workId)!=0) {
			//	PLASTIC.worksOpen($('.work-box[data-id="'+workId+'"]:eq(0)'));
			//}
			clearInterval(RC.scrollInterval);
		});

		$('body').on('click', '.slideshow-button, .slideshow-wrapper ul li div', function () {
		    RC.headerScroll.goToPage($(this).data('index') || 0, 0, 1000);
		    RC.animateHeaderNav($(this).data('index') || 0);
		    clearInterval(RC.scrollInterval);
		});

		if (!Modernizr.touch) {

		    alert("escritorio");
			// intro background parrallax effect and update active option
			$(window).scroll(function () {
				var currentScroll=$(window).scrollTop(); // -100 -( ( $(window).scrollTop()-$('.page-intro').offset().top ) *.2 );
				$('.page-intro').css('background-position', 'left '+parseInt(-currentScroll*.2)+'px');
				$('.page-slider .slideshow-wrapper ul').css('top', parseInt(currentScroll*.5)+'px');

				// change active menu option

				var currentOption=$('[data-watch]:eq(0)').attr('id');
				$('[data-watch]').each(function (index, element){
					if ($(element).offset().top<$('body').scrollTop()+$('.page-header').height()+1) {
						currentOption=$(element).attr('id');
					}
				});
				// desktop menu update
				var currentItem=$('.top-bar-section .menu-item a[href="#'+currentOption+'"').parents('.menu-item');
				if (!currentItem.hasClass('active')) {
					currentItem.siblings(':not(.lang-selector)').removeClass('active');
					currentItem.addClass('active');
					// mobile menu update
					currentItem=$('.mobile-menu .menu-item a[href="#'+currentOption+'"').parents('.menu-item');
					currentItem.siblings(':not(.lang-selector)').removeClass('active');
					currentItem.addClass('active');
				}
			});
		}

		// set active lang
		if (GLOBALS && GLOBALS.lang && GLOBALS.lang=='es') {
			$('.lang-es').addClass('active');
		} else {
			$('.lang-en').addClass('active');
		}
	},

	animateHeaderNav: function plastic_animateHeaderNav(index) {
		var navWidth=32;
		$('.slideshow-current').animate({
			'left': (navWidth*index)+'px'
		},400);
	},


	// works columns vars
	worksContainer:null,
	worksContainerWidth: 0,
	worksBoxes: null,
	worksFilterCategory: '',
	columnsHeights: [],
	maxHeight: 0,

	numColumns: 0,
	minColumns: 1,
	maxColumns: 5,

	leftMargin: 0,
	boxWidth: 0,

	columnWidth: 400,
	columnWidthTablet:300,
	columnGutter: 20,

	currentWork:null,
	mainOverlay:null,
	mainOverlayContent:null,

	deferredObject: null,

	worksInit: function rc_worksInit() {
	    RC.worksContainer = $('.works-container:eq(0)');
	    RC.worksBoxes = $('.works-container .work-box');

	    $(window).resize(RC.worksCalculate).resize();

	    alert(Modernizr.touch);
		//listen click on works boxes
	    if (Modernizr.touch) {
	        
			$('body').on('click', '.works-container .work-box', function (e) {
				$(this).addClass('active');
				$(this).find('.work-overlay').animate({ 'top' : '0%' },500);
				var previous=$(this).siblings('.work-box.active')
				previous.removeClass('active');
				previous.find('.work-overlay').animate({ 'top' : '100%' },500);
			});
		} else {
			$('body').on('mouseenter', '.works-container .work-box', function (e) {
				//$(this).addClass('hover');
				$(this).find('.work-overlay').animate({ 'top' : '0%' },500);
			});
			$('body').on('mouseleave', '.works-container .work-box', function (e) {
				//$(this).removeClass('hover');
				$(this).find('.work-overlay').animate({ 'top' : '100%' },500);
			});
			$('body').on('click', '.works-container .work-box', function (e) {
			    RC.worksOpen($(this));
			});
		}

		$('body').on('click', '.work-filters li', function () {
		    RC.worksFilter($(this));
		});

		$('body').on('click', '.main-overlay-menu .close', function () {
			//$('.main-overlay').fadeOut();
			//$('body').removeClass('no-scroll');
		    RC.closeWork();
		});

		$('body').on('click', '.main-overlay-menu .prev', function () {
			//$('.main-overlay').fadeOut();
			//$('body').removeClass('no-scroll');
		    RC.changeWork('prev');
		});

		$('body').on('click', '.main-overlay-menu .next', function () {
			//$('.main-overlay').fadeOut();
			//$('body').removeClass('no-scroll');
		    RC.changeWork('next');
		});

	},

	worksCalculate: function rc_worksCalculate() {

	    RC.worksContainerWidth = $(window).width(); //RC.worksContainer.width();
	    RC.boxWidth = ($(window).width() > 840) ? RC.columnWidth : RC.columnWidthTablet;
	    RC.numColumns = Math.floor(RC.worksContainerWidth / (RC.boxWidth + RC.columnGutter));
		

	    if (RC.numColumns > RC.maxColumns) { RC.numColumns = RC.maxColumns; }
	    if (RC.numColumns < RC.minColumns) {
	        RC.numColumns = RC.minColumns;
	        RC.boxWidth = Math.floor((RC.worksContainerWidth - (RC.columnGutter * (RC.numColumns + 1))) / RC.numColumns);
		}

	    RC.columnsHeights = [];
	    for (var i = 0; i < RC.numColumns; i++) {
	        RC.columnsHeights.push(0);
		}
	    RC.maxHeight = 0;


	    RC.leftMargin = Math.floor((RC.worksContainerWidth - (RC.numColumns * (RC.boxWidth + RC.columnGutter)) + RC.columnGutter) * .5);

		$('.works-container .work-box:not(.hidden)').each(function (index, element) {
		    var currentColumn = index % RC.numColumns;
			$(element).animate({
			    'left': ((RC.boxWidth + RC.columnGutter) * currentColumn),
			    'top': RC.columnsHeights[currentColumn],
			    'width': RC.boxWidth
			},500);
			var currentImage=$(element).find('.work-image:eq(0)');
			var currentImageHeight = currentImage.attr('height') * RC.boxWidth / currentImage.attr('width');
			RC.columnsHeights[currentColumn] += currentImageHeight + RC.columnGutter;
			if (RC.columnsHeights[currentColumn] > RC.maxHeight) { RC.maxHeight = RC.columnsHeights[currentColumn]; }
		});

		RC.worksContainer.stop().animate({
		    'left': RC.leftMargin,
		    'height': RC.maxHeight + RC.columnGutter,
		    'width': RC.worksContainerWidth - (RC.leftMargin * 2)
		},500);
	},

	worksFilter: function rc_worksFilter($element) {
		$element.siblings().removeClass('active');
		$element.addClass('active');

		var newWorksFilterCategory='';
		// if it's the first element show ALL
		if (!$element.is(':first-of-type')) {
			newWorksFilterCategory=$element.text();
		}
		if (newWorksFilterCategory != RC.worksFilterCategory) {
		    RC.worksFilterCategory = newWorksFilterCategory;
			
			// check if the works with the filter. show and hide items
		    RC.worksBoxes.each(function () {
		        if (RC.worksFilterCategory == '' || $(this).data('categories').indexOf(RC.worksFilterCategory) != -1) { // show all or filter match
					if ($(this).hasClass('hidden')) { 
						$(this).removeClass('hidden').css('opacity',0).show().animate({'opacity':1}); 
					}
				} else {
					$(this).addClass('hidden').animate({'opacity':0});
				}
			});

		    RC.worksCalculate();

			setTimeout(function () {
			    RC.worksBoxes.each(function () {
					if ($(this).hasClass('hidden')) {
						$(this).hide();
					}
				});
				
			},550);

		}
		
	},

	worksOpen: function rc_worksOpen($element) {
	   
	    RC.currentWork = $element;
	    RC.mainOverlay = $('.main-overlay:eq(0)');
	    RC.mainOverlayContent = $('.main-overlay-content:eq(0)');
	    RC.mainOverlay.hide().css({
	        'left': RC.currentWork.offset().left,
	        'top': RC.currentWork.offset().top - $(window).scrollTop(),
	        'width': RC.currentWork.width(),
	        'height': RC.currentWork.height(),
	        'background-color': RC.currentWork.data('background')
		});
	    RC.mainOverlayContent.css({
	        'background-color': RC.currentWork.data('background')
		})
	    RC.mainOverlay.fadeIn(500, function () {
	        RC.currentWork.css('visibility', 'hidden');
	        RC.mainOverlay.stop().animate({
	            'left': ($(window).width() - RC.currentWork.width()) * .5,
	            'top': ($(window).height() - RC.currentWork.height()) * .5
			},500,function () {
			    RC.mainOverlay.animate({
					'left': 0,
					'top': 0,
					'width': '100%', //$(window).width(),
					'height': '100%' //$(window).height()
				}, 500, function () {
				    RC.loadWork(RC.currentWork.data('id'), RC.currentWork.data('slug'));
					$('body').addClass('no-scroll');
					RC.mainOverlay.removeClass('no-scroll');
				});
			});
		});
	},

	closeWork: function rc_closeWork() {
	    RC.mainOverlay = $('.main-overlay:eq(0)');
	    RC.mainOverlayContent = $('.main-overlay-content:eq(0)');
		$('.main-overlay-menu').removeClass('active');
		RC.mainOverlayContent.fadeOut(500, function () {
			$('body').removeClass('no-scroll');
			RC.mainOverlay.addClass('no-scroll').animate({
			    'left': ($(window).width() - RC.currentWork.width()) * .5,
			    'top': ($(window).height() - RC.currentWork.height()) * .5,
			    'width': RC.currentWork.width(),
			    'height': RC.currentWork.height()
			}, 500, function () {
			    RC.mainOverlay.animate({
			        'left': RC.currentWork.offset().left,
			        'top': RC.currentWork.offset().top - $(window).scrollTop()
				}, 500, function () {
				    RC.currentWork.css('visibility', 'visible');
				    RC.mainOverlay.fadeOut(500, function () {
						if (window.history.pushState) {
							if (!window.location.origin) {
								window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
							}
							window.history.pushState({path:'#'},'',window.location.origin+window.location.pathname+'#'); // leave just the #
						}
						$('.main-overlay-content').html('');
					});
					
				});
			});
		});
		
	},

	changeWork: function rc_prevWork(prevOrNext) {
		//show hidden work
	    RC.currentWork.css('visibility', 'visible');
		//change currentWork
		switch (prevOrNext) {
			case 'prev':
			    if (!RC.currentWork.is(':first-child')) {
			        RC.currentWork = RC.currentWork.prev();
				} else {
			        RC.currentWork = RC.currentWork.siblings().last();
				}
				break;

			default:
			case 'next':
			    if (!RC.currentWork.is(':last-child')) {
			        RC.currentWork = RC.currentWork.next();
				} else {
			        RC.currentWork = RC.currentWork.siblings().first();
				}
				break;
		}
		// hide new currentwork
		RC.currentWork.css('visibility', 'hidden');

		RC.mainOverlay = $('.main-overlay:eq(0)');
		RC.mainOverlayContent = $('.main-overlay-content:eq(0)');
		RC.mainOverlayContent.fadeOut(function () {
		    RC.mainOverlay.css({
		        'background-color': RC.currentWork.data('background')
			});
		    RC.mainOverlayContent.css({
		        'background-color': RC.currentWork.data('background')
			})
		    RC.mainOverlayContent.html('');
		    RC.loadWork(RC.currentWork.data('id'), RC.currentWork.data('slug'));
		});
		
	},

	loadWork: function rc_loadWork(id,slug) {
	    if (RC.deferredObject) {
	        RC.deferredObject.reject();
	        RC.deferredObject = null;
		}
		$('.main-overlay').addClass('loading');
		if (window.history.pushState) {
			if (!window.location.origin) {
			    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
			    console.log("Entro 1");
			}
			window.history.pushState({ path: '#' + slug }, '', window.location.origin + window.location.pathname + '#' + slug); // change the url on the broser #slug

			
		}
       
	    // AQUI ES DONDE SE VA A CARGAR EL CONTENIDO CUANDO SE LE DE CLICK

	    //$.post('','', 'html').done(function (data) {
		$('.main-overlay').addClass('loading');
		var $result = $("<div>").html();
		//var $images = $result.find("img");
			var counter = 0;
		    
			var contenidoMostrar = $("#Contenido_" + id).html();

			
			RC.deferredObject = $.Deferred();
			if ($images.length!=0) {
				//$images.each(function(){
				//    // if image is already loaded, increment counter and move on.
				//    if (this.complete || this.readystate === 4) {
				//        counter++;

				//        // if all images are preloaded, resolve deferred object
				//        if (counter === $images.length) RC.deferredObject.resolve();
				//    }
				//    else {
				//        // since the image isn't already preloaded, bind the load event.
				//        $(this).load(function(){
				//            counter++;
				//            // if all images are preloaded, resolve deferred object
				//            if (counter === $images.length) RC.deferredObject.resolve();
				//        });
				//    }
				//});
			} else {
			    RC.deferredObject.resolve()
			}
            
			

			// when done preloading, this function will happen.
			RC.deferredObject.done(function () {
			    $('.main-overlay').addClass('loading');
				//
				RC.mainOverlayContent.hide().html(contenidoMostrar).delay(500).fadeIn(1000);
				$('.main-overlay-menu').addClass('active');
				$('.main-overlay').removeClass('loading');
			});



			
		//});
	},


	mobileMenuInit: function rc_mobileMenuInit() {

		// listen for menu click
		$('body').on('click', '.page-header .top-bar .toggle-topbar a', function (e) {
			if (!$('.mobile-menu').hasClass('opened')) {
			    RC.mobileMenuOpen();
			} else {
			    RC.mobileMenuClose();
			}
			return false;
		});

		// listen to option click to close the menu if opened and scroll to the section
		$('body').on('click', '.mobile-menu li:not(.lang-selector) a', function () {
		    RC.mobileMenuClose();
			var that = this;
			setTimeout(function () {
				$('html, body').animate({
				    scrollTop: $($(that).attr('href')+':eq(0)').offset().top-$('.page-header').height()
				 }, 2000);
			},500);
			var currentItem = $(this).parents('.menu-item');
			currentItem.siblings(':not(.lang-selector)').removeClass('active');
			currentItem.addClass('active');
			return false;
		})
	},

	mobileMenuOpen: function rc_mobileMenuOpen() {
		$('.mobile-menu').stop().animate({
			'left':'60%'
		}).addClass('opened');
		$('.page-wrapper').stop().animate({
			'margin-left':'-30%'
		});
		$('.toggle-topbar.menu-icon').animate({
			'right': '10%'
		});
	},

	mobileMenuClose: function rc_mobileMenuClose() {
		$('.mobile-menu').stop().animate({
			'left':'100%'
		}).removeClass('opened');
		$('.page-wrapper').stop().animate({
			'margin-left':'0%'
		});
		$('.toggle-topbar.menu-icon').animate({
			'right': '0%'
		});
	}

}

$(document).ready(function () {
    RC.init();
});