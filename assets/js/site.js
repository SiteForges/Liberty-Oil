// Liberty Oil Inc — small progressive-enhancement script.
// Scroll-reveal animation on section content + a subtle header shadow on scroll.
// Fully optional: with no JS, every ".reveal" element is just visible, static content.
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sticky header shadow once the page has scrolled past the top.
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Scroll-reveal: only opt in if motion is allowed and the browser supports it.
  if (reduceMotion || !("IntersectionObserver" in window)) {
    return;
  }

  root.classList.add("js");

  var targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (t) {
    io.observe(t);
  });
})();
