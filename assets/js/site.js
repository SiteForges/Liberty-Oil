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

// Floating "Liberty Oil AI" widget: draggable, position remembered, click to open.
(function () {
  "use strict";
  var widget = document.getElementById("aiWidget");
  var bubble = document.getElementById("aiBubble");
  var panel = document.getElementById("aiPanel");
  var closeBtn = document.getElementById("aiClose");
  if (!widget || !bubble || !panel) return;

  // Restore saved position.
  try {
    var saved = JSON.parse(localStorage.getItem("libertyOilAiPos") || "null");
    if (saved && typeof saved.right === "number" && typeof saved.bottom === "number") {
      widget.style.right = saved.right + "px";
      widget.style.bottom = saved.bottom + "px";
    }
  } catch (e) {}

  var dragging = false;
  var moved = false;
  var startX = 0, startY = 0, startRight = 0, startBottom = 0;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function onPointerDown(e) {
    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    var rect = widget.getBoundingClientRect();
    startRight = window.innerWidth - rect.right;
    startBottom = window.innerHeight - rect.bottom;
    bubble.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
    var newRight = clamp(startRight - dx, 8, window.innerWidth - 66);
    var newBottom = clamp(startBottom - dy, 8, window.innerHeight - 66);
    widget.style.right = newRight + "px";
    widget.style.bottom = newBottom + "px";
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    try {
      bubble.releasePointerCapture(e.pointerId);
    } catch (err) {}
    var rect = widget.getBoundingClientRect();
    var pos = {
      right: window.innerWidth - rect.right,
      bottom: window.innerHeight - rect.bottom,
    };
    try {
      localStorage.setItem("libertyOilAiPos", JSON.stringify(pos));
    } catch (e2) {}
    if (!moved) togglePanel();
  }

  function togglePanel() {
    var isHidden = panel.hasAttribute("hidden");
    if (isHidden) {
      panel.removeAttribute("hidden");
      bubble.setAttribute("aria-expanded", "true");
    } else {
      panel.setAttribute("hidden", "");
      bubble.setAttribute("aria-expanded", "false");
    }
  }

  bubble.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      panel.setAttribute("hidden", "");
      bubble.setAttribute("aria-expanded", "false");
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      panel.setAttribute("hidden", "");
      bubble.setAttribute("aria-expanded", "false");
    }
  });
})();
