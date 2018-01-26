var $ = jQuery; // Use the $ sign in your jQuery plugin

var PLASTIC = PLASTIC || {

	headerScroll: null,
	scrollInterval: null,
	scrollIntervalDelay: 5000,

	init: function plastic_init() {
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
			    scrollTop: $('#about').offset().top-$('.page-header').height()
			 }, 2000);
		});

		// run iscroll
		PLASTIC.headerScroll = new IScroll('.slideshow-wrapper', {
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

		PLASTIC.headerScroll.on('scrollEnd', function () {
			PLASTIC.animateHeaderNav(PLASTIC.headerScroll.currentPage.pageX||0);
		});

		PLASTIC.scrollInterval=setInterval(function () {
			var nextPage=PLASTIC.headerScroll.currentPage.pageX+1;
			if (nextPage>=$('.slideshow-wrapper li').length) {
				nextPage=0;
			}
 			PLASTIC.headerScroll.goToPage(nextPage,0,1000);
		}, PLASTIC.scrollIntervalDelay);

		$('.slideshow-wrapper').on('tap', 'li', function () {
			var workId=$(this).data('id');
			//if (parseInt(workId)!=0) {
			//	PLASTIC.worksOpen($('.work-box[data-id="'+workId+'"]:eq(0)'));
			//}
			clearInterval(PLASTIC.scrollInterval);
		});

		$('body').on('click', '.slideshow-button, .slideshow-wrapper ul li div', function () {
			PLASTIC.headerScroll.goToPage($(this).data('index')||0,0,1000);
			PLASTIC.animateHeaderNav($(this).data('index')||0);
			clearInterval(PLASTIC.scrollInterval);
		});

		if (!Modernizr.touch) {
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

		// check the hashtags if there's any at init and show the work
	    //console.log(window.location.hash);

		//var workOnStart = $('.work-box[data-slug="'+window.location.hash.substring(1)+'"]:eq(0)');
		//if (workOnStart.length!=0) {
		//	PLASTIC.worksOpen(workOnStart);
		//}

		// set active lang
		if (GLOBALS && GLOBALS.lang && GLOBALS.lang=='es') {
			$('.lang-es').addClass('active');
		} else {
			$('.lang-en').addClass('active');
		}

		/*
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $(this);
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur();

		$('[placeholder]').parents('form').submit(function() {
			$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
					input.val('');
				}
			})
		});
		*/
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

	worksInit: function plastic_worksInit() {
		PLASTIC.worksContainer=$('.works-container:eq(0)');
		PLASTIC.worksBoxes=$('.works-container .work-box');

		$(window).resize(PLASTIC.worksCalculate).resize();

		//listen click on works boxes
		if (Modernizr.touch) {
			$('body').on('click', '.works-container .work-box', function (e) {
				$(this).addClass('active');
				$(this).find('.work-overlay').animate({ 'top' : '0%' },500);
				var previous=$(this).siblings('.work-box.active')
				previous.removeClass('active');
				previous.find('.work-overlay').animate({ 'top' : '100%' },500);
			});
			//$('body').on('click', '.works-container .work-box.active .work-overlay', function (e) {
			//	PLASTIC.worksOpen($(this).parent('.work-box'));
			//	$('.works-container .work-box.hover').removeClass('hover');
			//	e.preventDefault();
			//});
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
				PLASTIC.worksOpen($(this));
			});
		}

		/*
		//listen click on works boxes
		$('body').on('click', '.works-container .work-box', function (e) {
			PLASTIC.worksOpen($(this));
			
			//$('.page-header, .main-overlay').addClass('active');
			//$('body').addClass('no-scroll');
			//$.post( 'http://plasticbcn.com/works-ajax-loader/', { 'id':$(this).data('id') } ).done( function(data) {
			//	//var result = $(data);
			//	$('.main-overlay-content').html(data);
			//});
			
		});
		*/

		$('body').on('click', '.work-filters li', function () {
			PLASTIC.worksFilter($(this));
		});

		$('body').on('click', '.main-overlay-menu .close', function () {
			//$('.main-overlay').fadeOut();
			//$('body').removeClass('no-scroll');
			PLASTIC.closeWork();
		});

		$('body').on('click', '.main-overlay-menu .prev', function () {
			//$('.main-overlay').fadeOut();
			//$('body').removeClass('no-scroll');
			PLASTIC.changeWork('prev');
		});

		$('body').on('click', '.main-overlay-menu .next', function () {
			//$('.main-overlay').fadeOut();
			//$('body').removeClass('no-scroll');
			PLASTIC.changeWork('next');
		});

	},

	worksCalculate: function plastic_worksCalculate() {

		PLASTIC.worksContainerWidth=$(window).width(); //PLASTIC.worksContainer.width();
		PLASTIC.boxWidth=($(window).width()>840)?PLASTIC.columnWidth:PLASTIC.columnWidthTablet;
		PLASTIC.numColumns=Math.floor(PLASTIC.worksContainerWidth/(PLASTIC.boxWidth+PLASTIC.columnGutter));
		

		if (PLASTIC.numColumns>PLASTIC.maxColumns) { PLASTIC.numColumns=PLASTIC.maxColumns; }
		if (PLASTIC.numColumns<PLASTIC.minColumns) {
			PLASTIC.numColumns=PLASTIC.minColumns; 
			PLASTIC.boxWidth=Math.floor((PLASTIC.worksContainerWidth-(PLASTIC.columnGutter*(PLASTIC.numColumns+1)))/PLASTIC.numColumns);
		}

		PLASTIC.columnsHeights=[];
		for(var i = 0; i < PLASTIC.numColumns; i++) {
			PLASTIC.columnsHeights.push(0);
		}
		PLASTIC.maxHeight=0;


		PLASTIC.leftMargin=Math.floor((PLASTIC.worksContainerWidth-(PLASTIC.numColumns*(PLASTIC.boxWidth+PLASTIC.columnGutter))+PLASTIC.columnGutter)*.5);

		$('.works-container .work-box:not(.hidden)').each(function (index, element) {
			var currentColumn = index%PLASTIC.numColumns;
			$(element).animate({
				'left' : ((PLASTIC.boxWidth+PLASTIC.columnGutter)*currentColumn),
				'top': PLASTIC.columnsHeights[currentColumn],
				'width' : PLASTIC.boxWidth
			},500);
			var currentImage=$(element).find('.work-image:eq(0)');
			var currentImageHeight=currentImage.attr('height')*PLASTIC.boxWidth/currentImage.attr('width');
			PLASTIC.columnsHeights[currentColumn]+=currentImageHeight+PLASTIC.columnGutter;
			if (PLASTIC.columnsHeights[currentColumn]>PLASTIC.maxHeight) { PLASTIC.maxHeight=PLASTIC.columnsHeights[currentColumn]; }
		});

		PLASTIC.worksContainer.stop().animate({
			'left': PLASTIC.leftMargin,
			'height' : PLASTIC.maxHeight+PLASTIC.columnGutter,
			'width' : PLASTIC.worksContainerWidth-(PLASTIC.leftMargin*2)
		},500);
	},

	worksFilter: function plastic_worksFilter($element) {
		$element.siblings().removeClass('active');
		$element.addClass('active');

		var newWorksFilterCategory='';
		// if it's the first element show ALL
		if (!$element.is(':first-of-type')) {
			newWorksFilterCategory=$element.text();
		}
		if (newWorksFilterCategory!=PLASTIC.worksFilterCategory) {
			PLASTIC.worksFilterCategory=newWorksFilterCategory;
			
			// check if the works with the filter. show and hide items
			PLASTIC.worksBoxes.each(function () {
				if (PLASTIC.worksFilterCategory=='' || $(this).data('categories').indexOf(PLASTIC.worksFilterCategory)!=-1) { // show all or filter match
					if ($(this).hasClass('hidden')) { 
						$(this).removeClass('hidden').css('opacity',0).show().animate({'opacity':1}); 
					}
				} else {
					$(this).addClass('hidden').animate({'opacity':0});
				}
			});

			PLASTIC.worksCalculate();

			setTimeout(function () {
				PLASTIC.worksBoxes.each(function () {
					if ($(this).hasClass('hidden')) {
						$(this).hide();
					}
				});
				
			},550);

		}
		
	},

	worksOpen: function plastic_worksOpen($element) {
	   
		PLASTIC.currentWork=$element;
		PLASTIC.mainOverlay=$('.main-overlay:eq(0)');
		PLASTIC.mainOverlayContent=$('.main-overlay-content:eq(0)');
		PLASTIC.mainOverlay.hide().css({
			'left': PLASTIC.currentWork.offset().left,
			'top': PLASTIC.currentWork.offset().top-$(window).scrollTop(),
			'width': PLASTIC.currentWork.width(),
			'height': PLASTIC.currentWork.height(),
			'background-color': PLASTIC.currentWork.data('background')
		});
		PLASTIC.mainOverlayContent.css({
			'background-color': PLASTIC.currentWork.data('background')
		})
		PLASTIC.mainOverlay.fadeIn(500,function() {
			PLASTIC.currentWork.css('visibility','hidden');
			PLASTIC.mainOverlay.stop().animate({
				'left': ($(window).width()-PLASTIC.currentWork.width())*.5,
				'top': ($(window).height()-PLASTIC.currentWork.height())*.5
			},500,function () {
				PLASTIC.mainOverlay.animate({
					'left': 0,
					'top': 0,
					'width': '100%', //$(window).width(),
					'height': '100%' //$(window).height()
				}, 500, function () {
					PLASTIC.loadWork(PLASTIC.currentWork.data('id'), PLASTIC.currentWork.data('slug'));
					$('body').addClass('no-scroll');
					PLASTIC.mainOverlay.removeClass('no-scroll');
				});
			});
		});
	},

	closeWork: function plastic_closeWork() {
		PLASTIC.mainOverlay=$('.main-overlay:eq(0)');
		PLASTIC.mainOverlayContent=$('.main-overlay-content:eq(0)');
		$('.main-overlay-menu').removeClass('active');
		PLASTIC.mainOverlayContent.fadeOut(500, function () {
			$('body').removeClass('no-scroll');
			PLASTIC.mainOverlay.addClass('no-scroll').animate({
				'left': ($(window).width()-PLASTIC.currentWork.width())*.5,
				'top': ($(window).height()-PLASTIC.currentWork.height())*.5,
				'width': PLASTIC.currentWork.width(),
				'height': PLASTIC.currentWork.height()
			}, 500, function () {
				PLASTIC.mainOverlay.animate({
					'left': PLASTIC.currentWork.offset().left,
					'top': PLASTIC.currentWork.offset().top-$(window).scrollTop()
				}, 500, function () {
					PLASTIC.currentWork.css('visibility','visible');
					PLASTIC.mainOverlay.fadeOut(500, function () {
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

	changeWork: function plastic_prevWork(prevOrNext) {
		//show hidden work
		PLASTIC.currentWork.css('visibility','visible');
		//change currentWork
		switch (prevOrNext) {
			case 'prev':
				if (!PLASTIC.currentWork.is(':first-child')) {
					PLASTIC.currentWork=PLASTIC.currentWork.prev();
				} else {
					PLASTIC.currentWork=PLASTIC.currentWork.siblings().last();
				}
				break;

			default:
			case 'next':
				if (!PLASTIC.currentWork.is(':last-child')) {
					PLASTIC.currentWork=PLASTIC.currentWork.next();
				} else {
					PLASTIC.currentWork=PLASTIC.currentWork.siblings().first();
				}
				break;
		}
		// hide new currentwork
		PLASTIC.currentWork.css('visibility','hidden');

		PLASTIC.mainOverlay=$('.main-overlay:eq(0)');
		PLASTIC.mainOverlayContent=$('.main-overlay-content:eq(0)');
		PLASTIC.mainOverlayContent.fadeOut(function () {
			PLASTIC.mainOverlay.css({
				'background-color': PLASTIC.currentWork.data('background')			
			});
			PLASTIC.mainOverlayContent.css({
				'background-color': PLASTIC.currentWork.data('background')
			})
			PLASTIC.mainOverlayContent.html('');
			PLASTIC.loadWork(PLASTIC.currentWork.data('id'),PLASTIC.currentWork.data('slug'));
		});
		
	},

	loadWork: function plastic_loadWork(id,slug) {
		if (PLASTIC.deferredObject) {
			PLASTIC.deferredObject.reject();
			PLASTIC.deferredObject=null;
		}
		$('.main-overlay').addClass('loading');
		if (window.history.pushState) {
			if (!window.location.origin) {
				window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
			}
			window.history.pushState({path:'#'+slug},'',window.location.origin+window.location.pathname+'#'+slug); // change the url on the broser #slug
		}
       
	    // AQUI ES DONDE SE VA A CARGAR EL CONTENIDO CUANDO SE LE DE CLICK

		//$.post('','', 'html').done(function (data) {
		    var $result = $("<div>").html('<div class="work-box" data-id="373" data-background="#eff3f4" data-categories="App " data-slug="desigualtouch-screen"><img width="400" height="670" src="http://plasticbcn.com/wp-content/uploads/2014/05/thumnail.jpg" class="work-image wp-post-image" alt="thumnail" /></div>');
			var $images = $result.find("img");
			var counter = 0;
			
			PLASTIC.deferredObject = $.Deferred();
			if ($images.length!=0) {
				$images.each(function(){
				    // if image is already loaded, increment counter and move on.
				    if (this.complete || this.readystate === 4) {
				        counter++;

				        // if all images are preloaded, resolve deferred object
				        if (counter === $images.length) PLASTIC.deferredObject.resolve();
				    }
				    else {
				        // since the image isn't already preloaded, bind the load event.
				        $(this).load(function(){
				            counter++;
				            // if all images are preloaded, resolve deferred object
				            if (counter === $images.length) PLASTIC.deferredObject.resolve();
				        });
				    }
				});
			} else {
				PLASTIC.deferredObject.resolve()
			}
			// when done preloading, this function will happen.
			PLASTIC.deferredObject.done(function () {
			    
				$('.main-overlay').removeClass('loading');
				PLASTIC.mainOverlayContent.hide().html('<div class="work-box" data-id="373" data-background="#eff3f4" data-categories="App " data-slug="desigualtouch-screen"><img width="400" height="670" src="http://plasticbcn.com/wp-content/uploads/2014/05/thumnail.jpg" class="work-image wp-post-image" alt="thumnail" /></div>').delay(500).fadeIn(1000);
				$('.main-overlay-menu').addClass('active');
			});



			
		//});
	},

	/*
	// fix position of the page-info under the slider
	pageHeader:null,
	pageSlider:null,
	pageIntro:null,

	introPositionInit: function plastic_introPositionInit() {
		PLASTIC.pageHeader=$('.page-header:eq(0)');
		PLASTIC.pageSlider=$('.page-slider:eq(0)');
		PLASTIC.pageIntro=$('.page-intro:eq(0)');

		$(window).resize(PLASTIC.pageIntroCalculate).resize();
		PLASTIC.pageSlider.on("orbit:ready", PLASTIC.pageIntroCalculate );
	},
	
	pageIntroCalculate: function plastic_pageIntroCalculate() {
		// add 66px more if device is under 768px width. The slider caption is set under the slider and not over it
		var extraHeight=($(window).width()<768)?66:0;
		PLASTIC.pageIntro.css('margin-top',PLASTIC.pageHeader.height()+PLASTIC.pageSlider.height()+extraHeight+'px');
	},
	*/

	/*
	fixMenu: function plastic_fixMenu() {
		var top=$('.page-slider:eq(0)').height();
		var y = $(this).scrollTop();
		if (y >= top)
		{
			$('.page-header:eq(0)').addClass('float').css('top',top);
			if (!$('.page-slider:eq(0) .orbit-timer').hasClass('paused')) {
				$('.page-slider:eq(0) .orbit-timer').addClass('force-paused');
				$('.page-slider:eq(0) .orbit-timer span').click();
			}
		} else {
			$('.page-header:eq(0)').removeClass('float').css('top',0);
			if ($('.page-slider:eq(0) .orbit-timer').hasClass('paused') && $('.page-slider:eq(0) .orbit-timer').hasClass('force-paused')) {
				$('.page-slider:eq(0) .orbit-timer span').click();
				$('.page-slider:eq(0) .orbit-timer').removeClass('force-paused');
			}
		}
		
		// var top = $(".header-image:eq(0)").height();
		// var y = $(this).scrollTop();
		// if (y >= top && $('.main-navigation.down').is(':visible')) {
		//     $('.main-navigation.down').addClass('fixed');
		//     $(".header-image:eq(0)").addClass('fixed');
		// } else {
		//     $('.main-navigation.down').removeClass('fixed');
		//     $(".header-image:eq(0)").removeClass('fixed');
		// } 
	},
	*/

	mobileMenuInit: function plastic_mobileMenuInit() {

		// listen for menu click
		$('body').on('click', '.page-header .top-bar .toggle-topbar a', function (e) {
			if (!$('.mobile-menu').hasClass('opened')) {
				PLASTIC.mobileMenuOpen();
			} else {
				PLASTIC.mobileMenuClose();
			}
			return false;
		});

		// listen to option click to close the menu if opened and scroll to the section
		$('body').on('click', '.mobile-menu li:not(.lang-selector) a', function () {
			PLASTIC.mobileMenuClose();
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

	mobileMenuOpen: function plastic_mobileMenuOpen() {
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

	mobileMenuClose: function plastic_mobileMenuClose() {
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
	PLASTIC.init();
});