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

  // HEADER SCROLL
  _window.on('scroll', throttle(function() { // scrolled is a constructor for scroll delay listener
    var vScroll = _window.scrollTop();
    var header = $('.header')
    var headerHeight = header.height();
    var heroHeight = $('.section').first().outerHeight() - headerHeight;

    if ( vScroll > heroHeight ){
      header.addClass('is-fixed');
    } else {
      header.removeClass('is-fixed');
    }
  },10));


  // HAMBURGER TOGGLER
  $('[js-hamburger]').on('click', function(e){
    $(this).toggleClass('is-active');
    $('.mobile-navi').toggleClass('is-active');

    e.preventDefault();
    e.stopPropagation();
  });
  _document.on('click', function(e){
    if(!$(e.target).closest('.mobile-navi__menu').length) {
      if ( $('[js-hamburger]').is('.is-active') ) {
        closeMobileMenu();
      }
    }
  });

  function closeMobileMenu(){
    $('[js-hamburger]').toggleClass('is-active');
    $('.mobile-navi').toggleClass('is-active');
  }

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

  // scrolldown
  $('[js-scrolldown]').on('click', function(){
    $('body, html').animate({
        scrollTop: $(this).closest('.section').next().offset().top}, 1000);
  })



  // SVG TRANSFORM CALC
  function calcLogoTransform(){
    var logoLetters = $('[js-scroll-logo] svg').find('#logo-letter');

    logoLetters.each(function(i, letter){
      console.log(letter)
    })
  
  }

  calcLogoTransform();


  //////////
  // FULLPAGE
  //////////

  var sections = $('.section');
  var wHeight = _window.height();
  var wHeightPrev = 0;

  function listenScroll(){
    var scrollTop = 0;

    _window.on('wheel', function(e){

      if ( _mobileDevice || _window.width() < 992 || _window.height() < 500 ){

      } else {

        // GET SCROLL PARAMS
        var delta = e.originalEvent.deltaY
        var speedController = 2.4 // make it smooth
        if ( delta > 0 ){
          scrollTop = scrollTop + (delta / speedController)
        } else if ( delta < 0 ){
          scrollTop = scrollTop - Math.abs(delta / speedController)
        }

        // prevent scrolling past top
        if ( scrollTop < 0){
          scrollTop = 0
          return false
        }

        // don't scroll past bottom and reset val
        if ( scrollTop > (sections.length - 1) * wHeight ){
          scrollTop = (sections.length - 1) * wHeight

          // scroll footer ?
        }

        wHeightPrev = _window.height(); // update prevheight for reset calcultations
        scrollBy(Math.round(scrollTop))

        e.preventDefault();

      }

    });

    _window.on('resize', debounce(function(e){
      if ( _mobileDevice || _window.width() < 992 || _window.height() < 500 ){
        resetSections();
      }else{
        wHeight = _window.height();
        resizeScroll(scrollTop);
        setTimeout(function(){
          wHeightPrev = _window.height(); // update prevheight for reset calcultations
        }, 50)
      }

    }, 100));
  }

  function scrollBy(scrollTop){
    // SECTION ACTIONS
    var nextSectionNum = Math.floor(scrollTop / wHeight) + 1;
    var nextSection = sections[nextSectionNum]
    $(nextSection).css({
      'transform': 'translate3d(0,-'+scrollTop+'px,0)'
    })

    $(nextSection).addClass('is-current').siblings().removeClass('is-current');

    if ( nextSectionNum === 1){
      // var logoDashes = $('[js-scroll-logo] svg #logo-dash')
      // var logoLetters = $('[js-scroll-logo] svg #logo-letter')
      // var sizePowerScale = 1 - (scrollTop / wHeight / 3)
      // var sizePowerX =  (scrollTop / wHeight) * 70
      //
      // logoDashes.css({
      //   'transform': 'scale('+sizePowerScale+')'
      // })
      //
      // logoLetters.css({
      //   'transform': 'translateX('+sizePowerX+'px)'
      // })
      var logo = $('[js-scroll-logo] svg')
      var logoLetters = $('[js-scroll-logo] svg #logo-letter')
      var sizePowerScale = 1 - (scrollTop / wHeight / 5)
      var sizePowerScaleInvert = 1 + (scrollTop / wHeight / 2)
      var sizePowerX =  (scrollTop / wHeight) * 70

      // issue with transform origin
      // get boundings ?? bBox()

      logo.css({
        'transform': 'scale('+sizePowerScale+')'
      })
      logoLetters.css({
        'transform': 'scale('+sizePowerScaleInvert+')'
      })
    }

    // HEADER ANIMATION - scroll 80% of first screen
    // var whenHeaderMoves = (scrollTop / wHeight) + 1 > 1.8
    var header = $('.header')
    var whenHeaderMoves = Math.floor(scrollTop / ( wHeight - header.outerHeight() ) ) + 1

    if ( whenHeaderMoves === 1 ){
      header.removeClass('is-fixed');
      header.css({
        'transform': 'translate3d(0,-'+scrollTop+'px,0)'
      })
    } else if ( whenHeaderMoves > 1){
      header.addClass('is-fixed');
    } else if ( whenHeaderMoves < 1 ){
      header.removeClass('is-fixed');
    }
  }

  function resizeScroll(scrollTop){
    var nextSectionNum = Math.floor(scrollTop / wHeight) + 1;

    sections.each(function(i, section){
      if ( nextSectionNum < i ){
        // clear all past current transforms
        $(section).css({
          'transform': 'translate3d(0px,0,0)'
        })
      } else if (nextSectionNum === i){
        // normal scroll for current section
        var changedHeight = scrollTop - (Math.abs(wHeightPrev - wHeight) * i)
        $(section).css({
          'transform': 'translate3d(0,-'+changedHeight+'px,0)'
        })
      }else{

        $(section).css({
          'transform': 'translate3d(0,-'+ i * wHeight +'px,0)'
        })
      }
    });
  }

  function resetSections(){
    sections.each(function(i, section){
      $(section).css({
        'transform': 'translate3d(0,-'+0+'px,0)'
      })
    });

    // reset header
    var header = $('.header')

    header.addClass('is-fixed');
    header.css({
      'transform': 'translate3d(0,-'+0+'px,0)'
    })

  }

  listenScroll();


  //////////
  // TOGGLERS, ETC
  //////////
  $('[js-cta-choice-trigger]').on('click', function(){
    $(this).toggleClass('is-opened');
    $('[js-cta-choice-options]').toggleClass('is-opened');
  });

  $('[js-cta-choice-options] span').on('click', function(){
    $('.cta-choice__trigger span').text('Я разбираюсь '+ $(this).text() )
    $(this).addClass('is-chosen').siblings().removeClass('is-chosen');
    $('[js-cta-choice-trigger]').removeClass('is-opened');
    $('[js-cta-choice-options]').removeClass('is-opened');
  })

  // pro bono
  $('[js-more-bono]').on('click', function(){
    $('[js-more-bono]').fadeOut();
    $('[js-more-bono]').addClass('is-active');
    if ( _window.width() > 992 ){
      $('.pro-bono-card--hidden').fadeIn();
    } else if ( _window.width() > 568 ){
      $('.pro-bono-card:nth-child(n+3)').fadeIn();
    } else if ( _window.width() > 1 ){
      $('.pro-bono-card:nth-child(n+2)').fadeIn();
    }
  })

  _window.on('resize', debounce(function(){
    if ( $('[js-more-bono]').is('.is-active') ){
      $('[js-more-bono]').fadeIn();
      $('[js-more-bono]').removeClass('is-active')
      if ( _window.width() > 992 ){
        $('.pro-bono-card--hidden').fadeOut();
      } else if ( _window.width() > 568 ){
        $('.pro-bono-card:nth-child(n+3)').fadeOut();
      } else if ( _window.width() > 1 ){
        $('.pro-bono-card:nth-child(n+2)').fadeOut();
      }
    }
  }, 300))



  //////////
  // SLIDERS
  //////////

  var slickNextArrow = '<div class="slick-prev"><svg class="ico ico-slick-prev"><use xlink:href="img/sprite.svg#ico-slick-prev"></use></svg></div>';
  var slickPrevArrow = '<div class="slick-next"><svg class="ico ico-slick-next"><use xlink:href="img/sprite.svg#ico-slick-next"></use></svg></div>'

  $('[js-slider-requests]').slick({
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
    variableWidth: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      },
    ]
  });

  $('[js-full-slider]').slick({
    autoplay: false,
    dots: false,
    arrows: false,
    prevArrow: slickNextArrow,
    nextArrow: slickPrevArrow,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    // slidesToScroll: 1,
    centerMode: false,
    variableWidth: false
  });

  // slider full controls
  $('.slider-control__dot').on('click', function(){
    var parent = $(this).parent();
    var slideNum = parent.data('slide');

    parent.addClass('is-active').siblings().removeClass('is-active');

    // console.log(parent.parent().parent().find('[js-full-slider]'))
    parent.parent().parent().find('[js-full-slider]').slick('slickGoTo', slideNum - 1)
  })
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
