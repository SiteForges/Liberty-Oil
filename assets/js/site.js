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

  // Mobile hamburger menu.
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
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

  // Simple Q&A: answer directly, or navigate the visitor to the right page.
  var form = document.getElementById("aiForm");
  var input = document.getElementById("aiInput");
  var log = document.getElementById("aiLog");
  if (!form || !input || !log) return;

  var RULES = [
    { test: /hour|open|close|time/i, reply: "We're open every day, 7:00 AM to 12:00 AM (midnight)." },
    { test: /special|deal|discount|sale/i, reply: "Taking you to this week's specials…", go: "specials.html" },
    { test: /direction|address|where.*(you|store|located)|located|find you/i, reply: "1943 S Coast Hwy, Oceanside, CA 92054 — opening directions…", go: "https://www.google.com/maps/search/?api=1&query=1943+S+Coast+Hwy+Oceanside+CA+92054" },
    { test: /phone|call|number/i, reply: "You can reach us at (760) 754-8045." },
    { test: /doordash|deliver|order/i, reply: "Opening our DoorDash store…", go: "https://www.doordash.com/convenience/store/24620532" },
    { test: /beer|wine/i, reply: "Taking you to Beer & Wine…", go: "beer-wine.html" },
    { test: /soda|beverage|drink(?!.*energy)/i, reply: "Taking you to Soda & Beverage…", go: "soda-beverage.html" },
    { test: /snack|chip/i, reply: "Taking you to Snacks…", go: "snacks.html" },
    { test: /candy|sweet|gummy/i, reply: "Taking you to Candy…", go: "candy.html" },
    { test: /energy/i, reply: "Taking you to Energy Drinks…", go: "energy-drinks.html" },
    { test: /about|family|story/i, reply: "Taking you to our About page…", go: "about.html" },
    { test: /gas|fuel|price/i, reply: "We're known for low gas prices — stop by 1943 S Coast Hwy any time, 7 AM to midnight." },
    { test: /pier|beach|ocean/i, reply: "We're just up South Coast Highway from Oceanside Pier — see the map on our homepage." },
  ];

  function addMsg(text, isUser) {
    var p = document.createElement("p");
    p.className = "ai-msg" + (isUser ? " user" : "");
    p.textContent = text;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    addMsg(q, true);
    input.value = "";

    var matched = null;
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].test.test(q)) {
        matched = RULES[i];
        break;
      }
    }

    if (matched) {
      addMsg(matched.reply, false);
      if (matched.go) {
        setTimeout(function () {
          if (/^https?:/.test(matched.go)) {
            window.open(matched.go, "_blank", "noreferrer");
          } else {
            location.href = matched.go;
          }
        }, 700);
      }
    } else {
      addMsg("I can help with hours, specials, directions, our phone number, or what we carry — try asking one of those.", false);
    }
  });
})();
