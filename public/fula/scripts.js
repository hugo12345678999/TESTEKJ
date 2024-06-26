/*-----------------------------------------------------------------------------------

    Theme Name: FULA
    Theme URI: http://
    Description: The Multi-Purpose Onepage Template
    Author: UI-ThemeZ
    Author URI: http://themeforest.net/user/UI-ThemeZ
    Version: 1.0

-----------------------------------------------------------------------------------*/


$(function() {

    "use strict";

    var wind = $(window);


/* ----------------------------------------------------------------
                [ Navbar ( scrollIt ) ]
-----------------------------------------------------------------*/
    
    $.scrollIt({
      upKey: 38,                // key code to navigate to the next section
      downKey: 40,              // key code to navigate to the previous section
      easing: 'swing',          // the easing function for animation
      scrollTime: 600,          // how long (in ms) the animation takes
      activeClass: 'active',    // class given to the active nav element
      onPageChange: null,       // function(pageIndex) that is called when page is changed
      topOffset: -80            // offste (in px) for fixed top navigation
    });


/* ----------------------------------------------------------------
                [ Navbar ( Change Background & Logo ) ]
-----------------------------------------------------------------*/
    
    wind.on("scroll",function () {

        var bodyScroll = wind.scrollTop(),
            navbar = $(".navbar"),
            logo = $(".change .logo> img");

        // if(bodyScroll > 100){
        //
        //     navbar.addClass("nav-scroll");
        //     logo.attr('src', 'fula/logo_fit2sell.png');
        //
        // }else{
        //
        //     navbar.removeClass("nav-scroll");
        //     logo.attr('src', 'fula/logo_fit2sell.png');
        // }
        navbar.addClass("nav-scroll");
        logo.attr('src', 'fula/logo_fit2sell.png');
    });


    // close navbar-collapse when a  clicked
    $(".navbar-nav .nav-item").not(".dropdown").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });


/* ----------------------------------------------------------------
                [ Progress Bar ]
-----------------------------------------------------------------*/
    
    wind.on('scroll', function () {
        $(".skill-progress .progres").each(function () {
            var bottom_of_object = 
            $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = 
            $(window).scrollTop() + $(window).height();
            var myVal = $(this).attr('data-value');
            if(bottom_of_window > bottom_of_object) {
                $(this).css({
                    width : myVal
                });
            }
        });
    });


/* ----------------------------------------------------------------
                [ Sections Background Image From Data ]
-----------------------------------------------------------------*/
    
    var pageSection = $(".bg-img, section");
    pageSection.each(function(indx){
        
        if ($(this).attr("data-background")){
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });


/* ----------------------------------------------------------------
                [ Owl-Carousel ]
-----------------------------------------------------------------*/

    // Testimonials owlCarousel
    $('.testimonials .owl-carousel').owlCarousel({
        loop: true,
        margin: 60,
        items: 3,
        mouseDrag: false,
        autoplay: true,
        smartSpeed: 500,
        dots: false,
        nav: true,
        navText: ['<i class="pe-7s-angle-left"></i>','<i class="pe-7s-angle-right"></i>'],
        responsiveClass:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        }
    });

    // === End owl-carousel === //


/* ----------------------------------------------------------------
                [ magnificPopup ]
-----------------------------------------------------------------*/
    
    $('.gallery').magnificPopup({
        delegate: '.popimg',
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    
/* ----------------------------------------------------------------
                [ YouTubePopUp ]
-----------------------------------------------------------------*/    

    $("a.vid").YouTubePopUp();


/* ----------------------------------------------------------------
                [ countUp ]
-----------------------------------------------------------------*/
    
    $('.numbers .count').countUp({
        delay: 10,
        time: 1500
    });


    /* ----------------------------------------------------------------
                [ parallaxie ( Parallax ) ]
-----------------------------------------------------------------*/

    // parallaxie
    $('.parallaxie').parallaxie({
        speed: 0.6,
        size: "cover"
    });


/* ----------------------------------------------------------------
                [ accordion ]
-----------------------------------------------------------------*/
    
    $(".accordion").on("click",".title", function () {

        $(this).next().slideDown();

        $(".accordion-info").not($(this).next()).slideUp();

    });

    $(".accordion").on("click",".item", function () {

        $(this).addClass("active").siblings().removeClass("active");

    });


/* ----------------------------------------------------------------
                [ sticky Sidebar ]
-----------------------------------------------------------------*/


    $("#sticky_item").stick_in_parent();

});


// === window When Loading === //

$(window).on("load",function (){

    var wind = $(window);

/* ----------------------------------------------------------------
                [ Preloader ]
-----------------------------------------------------------------*/    

    $(".loading").fadeOut(500);



/* ----------------------------------------------------------------
                [ isotope Portfolio ( Masonery Style ) ]
-----------------------------------------------------------------*/
    
    $('.gallery').isotope({
      // options
      itemSelector: '.items'
    });

    var $gallery = $('.gallery').isotope({
      // options
    });

    // filter items on button click
    $('.filtering').on( 'click', 'span', function() {

        var filterValue = $(this).attr('data-filter');

        $gallery.isotope({ filter: filterValue });

    });

    $('.filtering').on( 'click', 'span', function() {

        $(this).addClass('active').siblings().removeClass('active');

    });


/* ----------------------------------------------------------------
                [ contact form validator ]
-----------------------------------------------------------------*/
    
    $('#contact-form').validator();

    $('#contact-form').on('submit', function (e) {
        if (!e.isDefaultPrevented()) {
            var url = "contact.php";

            $.ajax({
                type: "POST",
                url: url,
                data: $(this).serialize(),
                success: function (data)
                {
                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                    if (messageAlert && messageText) {
                        $('#contact-form').find('.messages').html(alertBox);
                        $('#contact-form')[0].reset();
                    }
                }
            });
            return false;
        }
    });

});
