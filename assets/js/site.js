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

// Spin-to-win wheel: one free spin every 12 hours, tracked per-browser via
// localStorage. The "_v1" key is versioned on purpose -- bumping it in a
// future update instantly resets the cooldown for every visitor.
(function () {
  "use strict";
  var STORAGE_KEY = "libertyOilWheel_v1";
  var COOLDOWN_MS = 12 * 60 * 60 * 1000;

  var PRIZES = ["Free with $50+ purchase"];
  var SEGMENT_DEG = 360 / PRIZES.length;

  var slot = document.getElementById("spinSlot");
  var backdrop = document.getElementById("wheelBackdrop");
  var closeBtn = document.getElementById("wheelClose");
  var disc = document.getElementById("wheelDisc");
  var spinBtn = document.getElementById("wheelSpinBtn");
  var resultEl = document.getElementById("wheelResult");
  var subEl = document.getElementById("wheelSub");
  if (!slot || !backdrop || !disc || !spinBtn) return;

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {};
    } catch (e) {
      return {};
    }
  }

  function getNextAvailableAt() {
    var raw = getState();
    return typeof raw.nextAvailableAt === "number" ? raw.nextAvailableAt : 0;
  }

  function getLastPrize() {
    return getState().lastPrize || "";
  }

  function setSpinResult(ts, prize) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nextAvailableAt: ts, lastPrize: prize }));
    } catch (e) {}
  }

  function formatCountdown(ms) {
    var totalSec = Math.max(0, Math.ceil(ms / 1000));
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    if (h > 0) return "Next spin: " + h + "h " + m + "m";
    if (m > 0) return "Next spin: " + m + "m " + s + "s";
    return "Next spin: " + s + "s";
  }

  function refreshSlot() {
    var remaining = getNextAvailableAt() - Date.now();
    slot.disabled = false;
    if (remaining > 0) {
      slot.classList.add("spin-slot-cooldown");
      slot.textContent = formatCountdown(remaining);
    } else {
      slot.classList.remove("spin-slot-cooldown");
      slot.textContent = "\uD83C\uDFA1 Spin & Win";
    }
  }

  refreshSlot();
  setInterval(refreshSlot, 1000);

  function openModal() {
    var onCooldown = getNextAvailableAt() - Date.now() > 0;
    disc.style.transition = "none";
    disc.style.transform = "translateZ(0) rotate(0deg)";
    void disc.offsetWidth; // force reflow so the next spin animates from 0

    if (onCooldown) {
      var prize = getLastPrize();
      spinBtn.disabled = true;
      spinBtn.textContent = "Already Spun";
      subEl.textContent = "Your next spin unlocks in 12 hours.";
      resultEl.hidden = !prize;
      if (prize) {
        resultEl.textContent = "You won: " + prize + "! Show this screen at checkout, or take a screenshot to show on your next visit. One-time use only per spin.";
      }
    } else {
      resultEl.hidden = true;
      spinBtn.disabled = false;
      spinBtn.textContent = "Spin the Wheel";
      subEl.textContent = "Free with $50+ purchase this week.";
    }
    backdrop.hidden = false;
  }

  function closeModal() {
    backdrop.hidden = true;
  }

  slot.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !backdrop.hidden) closeModal();
  });

  spinBtn.addEventListener("click", function () {
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;

    var targetIndex = Math.floor(Math.random() * PRIZES.length);
    var centerAngle = targetIndex * SEGMENT_DEG + SEGMENT_DEG / 2;
    var jitter = (Math.random() - 0.5) * (SEGMENT_DEG * 0.55);
    var fullSpins = 7;
    var rotation = fullSpins * 360 + (360 - centerAngle) + jitter;

    // openModal() sets an inline transition:none to reset the disc without
    // animating; clear it here so the stylesheet's real transition applies.
    disc.style.transition = "";
    void disc.offsetWidth;

    // Read the actual CSS transition duration rather than assuming it --
    // prefers-reduced-motion shortens it, and the reveal has to match
    // whatever really plays or it can fire way too early/late.
    var durationMs = parseFloat(getComputedStyle(disc).transitionDuration) * 1000 || 3600;

    disc.style.transform = "translateZ(0) rotate(" + rotation + "deg)";

    var nextAt = Date.now() + COOLDOWN_MS;
    var revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      var prize = PRIZES[targetIndex];
      resultEl.hidden = false;
      resultEl.textContent =
        prize === "Try Again Later"
          ? "So close! No prize this time \u2014 come back in 12 hours."
          : "You won: " + prize + "! Show this screen at checkout, or take a screenshot to show on your next visit. One-time use only per spin.";
      subEl.textContent = "Your next spin unlocks in 12 hours.";
      setSpinResult(nextAt, prize);
      refreshSlot();
    }
    disc.addEventListener(
      "transitionend",
      function (e) {
        if (e.propertyName === "transform") reveal();
      },
      { once: true }
    );
    // Safety net in case transitionend never fires (interrupted, tab backgrounded, etc).
    setTimeout(reveal, durationMs + 400);
  });
})();
