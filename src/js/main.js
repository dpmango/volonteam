$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  var _mobileDevice = isMobile();
  // detect mobile devices
  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  //////////
  // COMMON
  //////////

  // svg support for laggy browsers
  svg4everybody();

  // Viewport units buggyfill
  window.viewportUnitsBuggyfill.init({
    force: false,
    refreshDebounceWait: 250,
    appendToBody: true
  });


 	// Prevent # behavior
	$('[href="#"]').click(function(e) {
		e.preventDefault();
	});

	// Smoth scroll
	$('a[href^="#section"]').click( function() {
        var el = $(this).attr('href');
        $('body, html').animate({
            scrollTop: $(el).offset().top}, 1000);
        return false;
	});

  // FOOTER REVEAL
  function revealFooter() {
    var footer = $('[js-reveal-footer]');
    if (footer.length > 0) {
      var footerHeight = footer.outerHeight();
      var maxHeight = _window.height() - footerHeight > 100;
      if (maxHeight && !msieversion() ) {
        $('body').css({
          'margin-bottom': footerHeight
        });
        footer.css({
          'position': 'fixed',
          'z-index': -10
        });
      } else {
        $('body').css({
          'margin-bottom': 0
        });
        footer.css({
          'position': 'static',
          'z-index': 10
        });
      }
    }
  }
  revealFooter();
  _window.resized(100, revealFooter);

  // HEADER SCROLL
  _window.on('scroll', throttle(function() { // scrolled is a constructor for scroll delay listener
    var vScroll = _window.scrollTop();
    var header = $('.header')
    var headerHeight = header.height();
    var heroHeight = $('.section').first().outerHeight() - headerHeight;

    // if ( vScroll > headerHeight ){
    //   header.addClass('header--transformed');
    // } else {
    //   header.removeClass('header--transformed');
    // }

    if ( vScroll > heroHeight ){
      header.addClass('is-fixed');
    } else {
      header.removeClass('is-fixed');
    }
  },10));


  // HAMBURGER TOGGLER
  $('[js-hamburger]').on('click', function(){
    $(this).toggleClass('active');
    $('.mobile-navi').toggleClass('active');
  });

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering
  // user .active for li instead
  // $('.header__menu li').each(function(i,val){
  //   if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
  //     $(val).addClass('active');
  //   } else {
  //     $(val).removeClass('active')
  //   }
  // });

  //////////
  // FULLPAGE
  //////////

  var sections = $('.section');
  var wHeight = _window.height();

  function listenScroll(){
    var scrollTop = 0;

    _window.on('wheel', throttle(function(e){
      // GET SCROLL PARAMS
      var delta = e.originalEvent.deltaY
      if ( delta > 0 ){
        scrollTop = scrollTop + (delta / 2)
      } else if ( delta < 0 ){
        scrollTop = scrollTop - Math.abs(delta / 2)
      }

      // prevent scrolling past top
      if ( scrollTop < 0 ){
        return false
      }

      scrollBy(scrollTop)

      e.preventDefault();

    }, 1, {
      'leading': true
    }))

    _window.on('resize', throttle(function(e){
      wHeight = _window.height();
      scrollBy(scrollTop)

    }, 200));
  }

  function scrollBy(scrollTop){
    // SECTION ACTIONS
    var nextSectionNum = Math.floor(scrollTop / wHeight) + 1;
    var nextSection = sections[nextSectionNum]
    $(nextSection).css({
      'transform': 'translate3d(0,-'+scrollTop+'px,0)'
    })

    if ( nextSectionNum === 1){
      var logoDashes = $('[js-scroll-logo] svg #logo-dash')
      var logoLetters = $('[js-scroll-logo] svg #logo-letter')
      var sizePowerScale = 1 - (scrollTop / wHeight / 3)
      var sizePowerX =  (scrollTop / wHeight) * 70

      logoDashes.css({
        'transform': 'scale('+sizePowerScale+')'
      })

      logoLetters.css({
        'transform': 'translateX('+sizePowerX+'px)'
      })

    }

    if ( nextSectionNum > 1){
      $('.header').addClass('is-fixed');
    } else {
      $('.header').removeClass('is-fixed')
    }
  }

  listenScroll();

  //////////
  // SLIDERS
  //////////

  var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-slick-prev"><use xlink:href="img/sprite.svg#ico-slick-prev"></use></svg></div>';
  var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-slick-next"><use xlink:href="img/sprite.svg#ico-slick-next"></use></svg></div>'

  $('[js-slider]').slick({
    autoplay: false,
    dots: false,
    arrows: true,
    prevArrow: slickNextArrow,
    nextArrow: slickPrevArrow,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: false,
    variableWidth: false
  });

  //////////
  // MODALS
  //////////

  // Magnific Popup
  // var startWindowScroll = 0;
  $('[js-popup]').magnificPopup({
    type: 'inline',
    fixedContentPos: true,
    fixedBgPos: true,
    overflowY: 'auto',
    closeBtnInside: true,
    preloader: false,
    midClick: true,
    removalDelay: 300,
    mainClass: 'popup-buble',
    callbacks: {
      beforeOpen: function() {
        // startWindowScroll = _window.scrollTop();
        // $('html').addClass('mfp-helper');
      },
      close: function() {
        // $('html').removeClass('mfp-helper');
        // _window.scrollTop(startWindowScroll);
      }
    }
  });

  ////////////
  // UI
  ////////////

  // Tooltip - bootstrap 3 UI
  $('[data-toggle="tooltip"]').tooltip()


  // Masked input
  $(".js-dateMask").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
  $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});


});
