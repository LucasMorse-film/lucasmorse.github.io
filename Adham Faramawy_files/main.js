/**
 * skip-link-focus-fix.js
 */
(function () {
  var is_webkit = navigator.userAgent.toLowerCase().indexOf("webkit") > -1,
    is_opera = navigator.userAgent.toLowerCase().indexOf("opera") > -1,
    is_ie = navigator.userAgent.toLowerCase().indexOf("msie") > -1;

  if (
    (is_webkit || is_opera || is_ie) &&
    document.getElementById &&
    window.addEventListener
  ) {
    window.addEventListener(
      "hashchange",
      function () {
        var element = document.getElementById(location.hash.substring(1));

        if (element) {
          if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
            element.tabIndex = -1;
          }

          element.focus();
        }
      },
      false
    );
  }
})();

/**
 * Theme functions file.
 *
 * Contains handlers for navigation and widget area.
 */

(function ($) {
  var $body,
    $window,
    $sidebar,
    adminbarOffset,
    top = false,
    bottom = false,
    windowWidth,
    windowHeight,
    lastWindowPos = 0,
    topOffset = 0,
    bodyHeight,
    sidebarHeight,
    resizeTimer;

  // Toggle buttons and submenu items with active children menu items.
  $(".main-navigation .current-menu-ancestor > button").addClass("toggle-on");
  $(".main-navigation .current-menu-ancestor > .sub-menu").addClass(
    "toggled-on"
  );

  $(".dropdown-toggle > a").click(function (e) {
    var $this = $(this);
    e.preventDefault();
    $(this).parent().toggleClass("toggle-on");
    $(this).next(".sub-menu").slideToggle();
    //$(this).next( '.sub-menu' ).toggleClass( 'toggled-on' ).slideToggle();
    //$this.attr( 'aria-expanded', $this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
  });

  // Enable menu toggle for small screens.
  (function () {
    var secondary = $("#secondary"),
      button,
      menu,
      widgets,
      social;
    if (!secondary) {
      return;
    }

    button = $(".site-branding").find(".secondary-toggle");
    if (!button) {
      return;
    }

    // Hide button if there are no widgets and the menus are missing or empty.
    menu = secondary.find(".nav-menu");
    widgets = secondary.find("#widget-area");
    social = secondary.find("#social-navigation");
    if (
      !widgets.length &&
      !social.length &&
      (!menu || !menu.children().length)
    ) {
      button.hide();
      return;
    }

    button.on("click", function () {
      secondary.toggleClass("toggled-on");
      secondary.trigger("resize");
      $(this).toggleClass("toggled-on");
      $(".main-navigation").slideToggle();
    });
  })();

  // Sidebar scrolling.
  function resize() {
    windowWidth = $window.width();
    windowHeight = $window.height();
    bodyHeight = $body.height();
    sidebarHeight = $sidebar.height();

    if (992 > windowWidth) {
      top = bottom = false;
      $sidebar.removeAttr("style");
    }
  }

  function scroll(e) {
    var windowPos = $window.scrollTop();

    if (992 > windowWidth) {
      return;
    }

    if (sidebarHeight + adminbarOffset > windowHeight) {
      var max = sidebarHeight + adminbarOffset - windowHeight;
      var toMove = windowPos - lastWindowPos;
      topOffset -= toMove;

      if (topOffset <= -max) {
        topOffset = -max;
      } else if (topOffset >= 0) {
        topOffset = 0;
      }

      $sidebar.attr("style", "top: " + topOffset + "px;");
    } else if (!top) {
      top = true;
      $sidebar.attr("style", "top: 0px;");
    }

    lastWindowPos = windowPos;
  }

  function resizeAndScroll() {
    resize();
    scroll();
  }

  function tooltip() {
    $(document).tooltip({
      track: true,
    });
  }

  function pageLayout() {
    // Remove inline styles from captions
    $(".wp-caption").removeAttr("style");

    // Add tooltips to images on the computer programs page
    $(".category-computer-programs img")
      .parents("p")
      .addClass("tooltip-left")
      .attr("data-tooltip", "To download the program, click here");

    // const videos = document.querySelectorAll(".video-embed");

    // for (let i = 0; i < videos.length; i++) {
    //   const element = videos[i];
    //   if (element.classList.contains("is-loaded")) return false;
    //   element.classList.add("is-loaded");
    //   var ratio =
    //     element.querySelector("iframe").width /
    //     element.querySelector("iframe").height;
    //   var playerInner = element.querySelector(".js-plyr");
    //   element.classList.add(ratio < 1 ? "portrait" : "landscape");

    //   const player = new Plyr(playerInner, {
    //     controls: [
    //       "play",
    //       "play-large",
    //       "progress",
    //       "current-time",
    //       "mute",
    //       "volume",
    //       "fullscreen",
    //     ],
    //     vimeo: {
    //       byline: false,
    //       portrait: false,
    //       title: false,
    //       speed: false,
    //       transparent: false,
    //     },
    //     youtube: {
    //       noCookie: false,
    //       rel: 0,
    //       showinfo: 0,
    //       iv_load_policy: 3,
    //       modestbranding: 1,
    //     },
    //   });
    // }
  }

  $(document).ready(function () {
    $body = $(document.body);
    $window = $(window);
    $sidebar = $("#sidebar").first();
    adminbarOffset = $body.is(".admin-bar") ? $("#wpadminbar").height() : 0;

    $window
      .on("scroll.twentyfifteen", scroll)
      .on("resize.twentyfifteen", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeAndScroll, 500);
      });
    $sidebar.on("click keydown", "button", resizeAndScroll);

    resizeAndScroll();

    for (var i = 1; i < 6; i++) {
      setTimeout(resizeAndScroll, 100 * i);
    }

    pageLayout();

    // Infinite Scroll Callback
    $(document.body).on("post-load", function () {
      // New posts have been added to the page.
      pageLayout();
    });
  });
})(jQuery);
