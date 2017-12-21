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

  // scrolldown
  $('[js-scrolldown]').on('click', function(){
    $('body, html').animate({
        scrollTop: $(this).closest('.section').next().offset().top}, 1000);
  })



  // SVG TRANSFORM CALC
  function calcLogoTransform(){
    var logoLetters = $('[js-scroll-logo] svg').find('.logo-letter');

    logoLetters.each(function(i, letter){
      addTransformOrigin(letter)
    })

  }

  function addTransformOrigin(my_element){
    var bb = $(my_element).get(0).getBBox();
    var cx = bb.x + bb.width / 2;
    var cy = bb.y + bb.height / 2;

    var bodyStyle = "<style>"+ " ." + $(my_element).attr('class').split(' ')[1] + " { transform-origin: "+cx + 'px ' + cy + 'px'+"; }</style>"
    $( bodyStyle ).appendTo( "body" )
  }

  calcLogoTransform();
  _window.on('resize', debounce(calcLogoTransform, 300));


  //////////
  // FULLPAGE
  //////////
  var sections = $('.section');
  var sectionsHeights = [];
  var sectionsBreakPoints = [];
  var wHeight = _window.height();
  var wHeightPrev = 0;
  var whenFooterStarts = 0;
  var whenScrollStops = 0;
  var scrollTop = 0;

  function setSectionHeight(){
    sectionsHeights = [];
    sectionsBreakPoints = [];
    whenFooterStarts = 0
    whenScrollStops = 0

    sections.each(function(i, section){
      // get sections Heights
      sectionsHeights.push ( Math.floor( $(section).outerHeight() ))

      // get breakpoints
      var hBreakpoint = sectionsBreakPoints[sectionsBreakPoints.length-1] + $(section).outerHeight();
      if ( !hBreakpoint ){
        sectionsBreakPoints.push ( Math.floor( $(section).outerHeight() )) // push first when array is empty
      } else {
        sectionsBreakPoints.push ( Math.floor(hBreakpoint) )
      }
    })

    // set Footer and scrollStop
    $.each(sectionsHeights, function(i, sectionHeight){
      whenFooterStarts += sectionsHeights[i]
      if ( i === sectionsHeights.length - 1 ){
        whenFooterStarts = whenFooterStarts - sectionsHeights[i]
      }
    });

    whenScrollStops = whenFooterStarts + $('.footer').outerHeight()
  }
  // call goesw to slick init


  _window.on('wheel', throttle(function(e){
    listenScroll(e);
  }, 10));

  function listenScroll(e){
    if ( _mobileDevice || _window.width() < 992 || _window.height() < 500 ){
      // do nothing

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

      // scroll footer when all sections scrolled
      if ( scrollTop > whenFooterStarts ){
        // scrollTop = (sections.length - 1) * wHeight
        $('.footer').css({
          'transform': 'translate3d(0,-'+Math.round(scrollTop)+'px,0)',
          'z-index': 9
        })
        // scroll footer ?
      } else{
        $('.footer').css({
          'z-index': 1
        })
      }

      // don't scroll past sections and footer
      // (sections.length - 1) * wHeight + $('.footer').outerHeight()
      if ( scrollTop > whenScrollStops ){
        scrollTop = whenScrollStops;
        return false
      }

      wHeightPrev = _window.height(); // update prevheight for reset calcultations
      scrollBy(Math.round(scrollTop), delta)

      e.preventDefault();

    }
  }

  _window.on('resize', debounce(function(e){
    if ( _mobileDevice || _window.width() < 992 || _window.height() < 500 ){
      resetSections();
    }else{
      wHeight = _window.height();
      setSectionHeight();
      resizeScroll( Math.floor(scrollTop) );
      setTimeout(function(){
        _window.trigger('scroll, wheel');
        wHeightPrev = _window.height(); // update prevheight for reset calcultations
      }, 50)
    }

  }, 100));

  function scrollBy(scrollTop, delta){
    // SECTION ACTIONS
    // var nextSectionNum = Math.floor(scrollTop / wHeight) + 1;
    var nextSectionNum = 0;

    $.each(sectionsBreakPoints, function(i,sectionBP){
      // var overflowDiff = sectionsHeights[i+1] - sectionsHeights[i]
      var overflowDiff = sectionsHeights[i+1] - _window.height()

      if ( !overflowDiff || overflowDiff < 0 ){
        overflowDiff = 0
      }
      // console.log(
      //   'section #' + i + ' BP = ' + sectionBP,
      //   'overflowDiff ' + overflowDiff,
      //   'sectionBP + overflowDiff = ' + (sectionBP + overflowDiff),
      //   'scroll ' + scrollTop)

      if ( (sectionBP + overflowDiff) > scrollTop ){
        nextSectionNum = i + 1;
        return false;
      }
    });

    var nextSection = sections[nextSectionNum]

    $(nextSection).css({
      'transform': 'translate3d(0,-'+scrollTop+'px,0)'
    })
    // $(nextSection).css({
    //   'transform': 'translateY(-'+scrollTop+'px)'
    // })

    $(nextSection).addClass('is-current').siblings().removeClass('is-current');

    if ( delta < 0 ){
      // console.log('scrolling top')
    }

    // logo scale tranform
    if ( nextSectionNum === 1){
      var logo = $('[js-scroll-logo] svg')
      var logoLetters = $('[js-scroll-logo] svg .logo-letter')
      var sizePowerScale = 1 - (scrollTop / wHeight / 3)
      var sizePowerScaleInvert = 1 + (scrollTop / wHeight / 2)
      var sizePowerX =  (scrollTop / wHeight) * 70
      // tranform origin is preset with onload functions
      logo.css({
        'transform': 'scale('+sizePowerScale+')'
      })
      logoLetters.css({
        'transform': 'scale('+sizePowerScaleInvert+')'
      })
    }

    // HEADER ANIMATION
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
    // var nextSectionNum = Math.floor(scrollTop / wHeight) + 1;
    var nextSectionNum = 0;

    $.each(sectionsBreakPoints, function(i,sectionBP){
      // var overflowDiff = sectionsHeights[i+1] - sectionsHeights[i]
      var overflowDiff = sectionsHeights[i+1] - _window.height()

      if ( !overflowDiff || overflowDiff < 0 ){
        overflowDiff = 0
      }

      if ( (sectionBP + overflowDiff) > scrollTop ){
        nextSectionNum = i + 1;
        return false;
      }
    });

    sections.each(function(i, section){
      if ( nextSectionNum < i ){
        // clear all past current transforms
        $(section).attr('style', '')
      } else if (nextSectionNum === i){
        // normal scroll for current section
        // var changedHeight = scrollTop - (Math.abs(wHeightPrev - wHeight) * i)
        $(section).css({
          'transform': 'translate3d(0,-'+scrollTop+'px,0)'
        })
      }else{
        // $(section).css({
        //   'transform': 'translate3d(0,-'+ sectionsHeights[i] +'px,0)'
        // })
      }
      var nextSection = sections[nextSectionNum]

      $(nextSection).addClass('is-current').siblings().removeClass('is-current');

    });

    $('.footer').attr('style', "")

  }

  function resetSections(){
    sections.each(function(i, section){
      $(section).attr('style', "")
    });
    $('.footer').attr('style', "")

    // reset header
    var header = $('.header')

    header.addClass('is-fixed');
    header.attr('style', "")

  }


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
    setTimeout(function(){
      setSectionHeight();
    },300)
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

  $('[js-slider-requests]').on('init', function(event, slick){
    setSectionHeight();
  });

  $('[js-slider-requests]').slick({
    autoplay: false,
    dots: false,
    arrows: true,
    prevArrow: slickNextArrow,
    nextArrow: slickPrevArrow,
    infinite: true,
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

  $('[js-full-slider]').on('beforeChange', function(event, slick, currentSlide, nextSlide){
    var linkedControl = $(slick.$slider).closest('.section').find('.slider-control[data-slide='+ (nextSlide + 1) +']');
    linkedControl.addClass('is-active').siblings().removeClass('is-active');
  });

  // slider full controls
  $('.slider-control__dot').on('click', function(){
    var slideNum = $(this).parent().data('slide');

    // console.log(parent.parent().parent().find('[js-full-slider]'))
    $(this).closest('.section').find('[js-full-slider]').slick('slickGoTo', slideNum - 1)
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

  // Masked input
  $(".js-dateMask").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
  $("input[type='tel']").mask("+7 (000) 000-0000", {placeholder: "+7 (___) ___-____"});


});
